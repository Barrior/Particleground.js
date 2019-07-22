const { utils, Base, mount } = JParticles
const { random, PI, sin } = Math
const doublePI = PI * 2
const {
  limitRandom,
  scaleValue,
  randomColor,
  isArray,
  isPlainObject,
  isUndefined,
  resize,
} = utils

// 仅允许 opacity 和以下选项动态设置
const dynamicOptions = [
  'fill',
  'fillColor',
  'line',
  'lineColor',
  'lineWidth',
  'offsetLeft',
  'offsetTop',
  'crestHeight',
  'speed',
]

@mount('Wave')
class Wave extends Base {
  static defaultConfig = {
    // 线条个数
    num: 3,

    // 是否填充背景色，设置为 false 相关值无效
    fill: false,

    // 填充的背景色，当 fill 设置为 true 时生效
    fillColor: [],

    // 是否绘制边框，设置为 false 相关值无效
    line: true,

    // 边框颜色，当 line 设置为 true 时生效，下同
    lineColor: [],

    // 边框宽度，空数组则随机 [.2, 2) 的宽度。
    lineWidth: [],

    // 线条横向偏移值，距离 Canvas 画布左边的偏移值
    // (0, 1) 表示容器宽度的倍数，0 & [1, +∞) 表示具体数值
    offsetLeft: [],

    // 线条纵向偏移值，线条中点到 Canvas 画布顶部的距离
    // (0, 1) 表示容器高度的倍数，0 & [1, +∞) 表示具体数值
    offsetTop: [],

    // 波峰高度，(0, 1) 表示容器高度的倍数，0 & [1, +∞) 表示具体数值
    crestHeight: [],

    // 波纹个数，即正弦周期个数，默认随机 [1, 0.2 * 容器宽度)
    rippleNum: [],

    // 运动速度，默认随机 [.1, .4)
    speed: [],
  }

  constructor(selector, options) {
    super(Wave, selector, options)
  }

  init() {
    // 线条波长，每个周期(2π)在canvas上的实际长度
    this.rippleLength = []

    this.attrNormalize()
    this.createDots()
    this.draw()
  }

  attrNormalize() {
    const attrs = [
      'fill',
      'fillColor',
      'line',
      'lineColor',
      'lineWidth',
      'offsetLeft',
      'offsetTop',
      'crestHeight',
      'rippleNum',
      'speed',
    ]
    attrs.forEach(attr => this.attrProcessor(attr))
  }

  attrProcessor(attr) {
    let num = this.set.num
    let attrValue = this.set[attr]
    let stdValue = attrValue
    let scale = attr === 'offsetLeft' ? this.cw : this.ch

    if (!isArray(attrValue)) {
      stdValue = this.set[attr] = []
    }

    // 将数组、字符串、数字、布尔类型属性标准化，例如 num = 3：
    // crestHeight: []或[2]或[2, 2], 标准化成: [2, 2, 2]
    // crestHeight: 2, 标准化成: [2, 2, 2]
    // 注意：(0, 1)表示容器高度的倍数，0 & [1, +∞)表示具体数值，其他属性同理
    // scaleValue 用于处理属性值为 (0, 1) 或 0 & [1, +∞) 这样的情况，返回计算好的数值。
    while (num--) {
      const val = isArray(attrValue) ? attrValue[num] : attrValue

      stdValue[num] = isUndefined(val)
        ? this.generateDefaultValue(attr)
        : this.scaleValue(attr, val, scale)

      if (attr === 'rippleNum') {
        this.rippleLength[num] = this.cw / stdValue[num]
      }
    }
  }

  // 以下为缺省情况，属性对应的默认值
  generateDefaultValue(attr) {
    const { cw, ch } = this

    switch (attr) {
      case 'lineColor':
      case 'fillColor':
        attr = randomColor()
        break
      case 'lineWidth':
        attr = limitRandom(2, 0.2)
        break
      case 'offsetLeft':
        attr = random() * cw
        break
      case 'offsetTop':
      case 'crestHeight':
        attr = random() * ch
        break
      case 'rippleNum':
        attr = limitRandom(cw / 2, 1)
        break
      case 'speed':
        attr = limitRandom(0.4, 0.1)
        break
      case 'fill':
        attr = false
        break
      case 'line':
        attr = true
        break
    }
    return attr
  }

  scaleValue(attr, value, scale) {
    if (
      attr === 'offsetTop' ||
      attr === 'offsetLeft' ||
      attr === 'crestHeight'
    ) {
      return scaleValue(value, scale)
    }
    return value
  }

  dynamicProcessor(name, newValue) {
    const scale = name === 'offsetLeft' ? this.cw : this.ch
    const isArrayType = isArray(newValue)

    this.set[name].forEach((curValue, i, array) => {
      let value = isArrayType ? newValue[i] : newValue
      value = this.scaleValue(name, value, scale)

      // 未定义部分保持原有值
      if (isUndefined(value)) {
        value = curValue
      }

      array[i] = value
    })
  }

  setOptions(newOptions) {
    if (this.set && isPlainObject(newOptions)) {
      for (const name in newOptions) {
        if (name === 'opacity') {
          this.set.opacity = newOptions[name]
        } else if (dynamicOptions.indexOf(name) !== -1) {
          this.dynamicProcessor(name, newOptions[name])
        }
      }
    }
  }

  createDots() {
    const { cw, rippleLength } = this
    let { num } = this.set
    let dots = (this.dots = [])

    while (num--) {
      const line = (dots[num] = [])

      // 点的y轴步进
      const step = doublePI / rippleLength[num]

      // 创建一条线段所需的点
      for (let i = 0; i <= cw; i++) {
        line.push({
          x: i,
          y: i * step,
        })
      }
    }
  }

  draw() {
    const { ctx, cw, ch, paused, set } = this
    const { opacity } = set

    ctx.clearRect(0, 0, cw, ch)
    ctx.globalAlpha = opacity

    this.dots.forEach((line, i) => {
      const crestHeight = set.crestHeight[i]
      const offsetLeft = set.offsetLeft[i]
      const offsetTop = set.offsetTop[i]
      const speed = set.speed[i]

      ctx.save()
      ctx.beginPath()

      line.forEach((dot, j) => {
        ctx[j ? 'lineTo' : 'moveTo'](
          dot.x,

          // y = A sin ( ωx + φ ) + h
          crestHeight * sin(dot.y + offsetLeft) + offsetTop
        )
        !paused && (dot.y -= speed)
      })

      if (set.fill[i]) {
        ctx.lineTo(cw, ch)
        ctx.lineTo(0, ch)
        ctx.closePath()
        ctx.fillStyle = set.fillColor[i]
        ctx.fill()
      }

      if (set.line[i]) {
        ctx.lineWidth = set.lineWidth[i]
        ctx.strokeStyle = set.lineColor[i]
        ctx.stroke()
      }

      ctx.restore()
    })

    this.requestAnimationFrame()
  }

  resize() {
    resize(this, (scaleX, scaleY) => {
      ;['offsetLeft', 'offsetTop', 'crestHeight'].forEach(item => {
        const scale = item === 'offsetLeft' ? scaleX : scaleY
        this.set[item].forEach((attr, i, array) => {
          array[i] = attr * scale
        })
      })
      this.dots.forEach(line => {
        line.forEach(dot => {
          dot.x *= scaleX
          dot.y *= scaleY
        })
      })
    })
  }
}
