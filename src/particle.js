const { utils, Base, mount } = JParticles
const { random, abs, PI, floor } = Math
const doublePI = PI * 2
const {
  pInt,
  limitRandom,
  calcSpeed,
  scaleValue,
  getCss,
  offset,
  isElement,
  isNull,
  on,
  off,
  orientationSupport,
} = utils

/**
 * 检查元素或其祖先节点的属性是否等于预给值
 * @param elem {element} 起始元素
 * @param property {string} css属性
 * @param value {string} css属性值
 * @returns {boolean}
 */
function checkParentsProperty(elem, property, value) {
  while ((elem = elem.offsetParent)) {
    if (getCss(elem, property) === value) {
      return true
    }
  }
  return false
}

// 挂载特效到 JParticles 对象上
@mount('Particle')
class Particle extends Base {
  static defaultConfig = {
    // 粒子个数，默认为容器宽度的 0.12 倍
    // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
    // 0 是没有意义的
    num: 0.12,

    // 粒子最大半径(0, +∞)
    maxR: 2.4,

    // 粒子最小半径(0, +∞)
    minR: 0.6,

    // 粒子最大运动速度(0, +∞)
    maxSpeed: 1,

    // 粒子最小运动速度(0, +∞)
    minSpeed: 0.1,

    // 两点连线的最大值
    // 在 range 范围内的两点距离小于 proximity，则两点之间连线
    // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
    proximity: 0.2,

    // 定位点的范围，范围越大连线越多
    // 当 range 等于 0 时，不连线，相关值无效
    // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
    range: 0.2,

    // 线段的宽度
    lineWidth: 0.2,

    // 连线的形状
    // spider: 散开的蜘蛛状
    // cube: 合拢的立方体状
    lineShape: 'spider',

    // 改变定位点坐标的事件元素
    // null 表示 canvas 画布，或传入原生元素对象，如 document 等
    eventElem: null,

    // 视差效果 {boolean}
    parallax: false,

    // 定义粒子在视差图层里的层数及每层的层级大小，类似 css 里的 z-index。
    // 取值范围: [0, +∞)，值越小视差效果越强烈，0 则不动。
    // 定义四层粒子示例：[1, 3, 5, 10]
    parallaxLayer: [1, 2, 3],

    // 视差强度，值越小视差效果越强烈
    parallaxStrength: 3,
  }

  constructor(selector, options) {
    super(Particle, selector, options)
  }

  init() {
    this.attrNormalize()

    if (this.set.range > 0) {
      // 定位点坐标
      this.positionX = random() * this.cw
      this.positionY = random() * this.ch
      this.defineLineShape()
      this.positionEvent()
    }

    // 初始化鼠标在视差上的坐标
    this.mouseX = this.mouseY = 0
    this.createDots()
    this.draw()
    this.parallaxEvent()
  }

  attrNormalize() {
    const { cw, set } = this
    ;['num', 'proximity', 'range'].forEach(attr => {
      set[attr] = pInt(scaleValue(set[attr], cw))
    })

    // 设置触发事件的元素
    if (!isElement(set.eventElem) && set.eventElem !== document) {
      set.eventElem = this.c
    }
  }

  defineLineShape() {
    const { proximity, range, lineShape } = this.set
    switch (lineShape) {
      case 'cube':
        this.lineShapeMaker = (x, y, sx, sy, cb) => {
          const { positionX, positionY } = this
          if (
            abs(x - sx) <= proximity &&
            abs(y - sy) <= proximity &&
            abs(x - positionX) <= range &&
            abs(y - positionY) <= range &&
            abs(sx - positionX) <= range &&
            abs(sy - positionY) <= range
          ) {
            cb()
          }
        }
        break
      default:
        this.lineShapeMaker = (x, y, sx, sy, cb) => {
          const { positionX, positionY } = this
          if (
            abs(x - sx) <= proximity &&
            abs(y - sy) <= proximity &&
            ((abs(x - positionX) <= range && abs(y - positionY) <= range) ||
              (abs(sx - positionX) <= range && abs(sy - positionY) <= range))
          ) {
            cb()
          }
        }
    }
  }

  createDots() {
    const { cw, ch, color } = this
    let { num, maxR, minR, maxSpeed, minSpeed, parallaxLayer } = this.set
    let layerLength = parallaxLayer.length
    this.dots = []

    while (num--) {
      let r = limitRandom(maxR, minR)
      this.dots.push({
        r,
        x: limitRandom(cw - r, r),
        y: limitRandom(ch - r, r),
        vx: calcSpeed(maxSpeed, minSpeed),
        vy: calcSpeed(maxSpeed, minSpeed),
        color: color(),

        // 定义粒子在视差图层里的层数及每层的层级大小
        parallaxLayer: parallaxLayer[floor(random() * layerLength)],

        // 定义粒子视差的偏移值
        parallaxOffsetX: 0,
        parallaxOffsetY: 0,
      })
    }
  }

  draw() {
    const { cw, ch, ctx } = this
    const { range, lineWidth, opacity } = this.set

    ctx.clearRect(0, 0, cw, ch)

    // 当canvas宽高改变的时候，全局属性需要重新设置
    ctx.lineWidth = lineWidth
    ctx.globalAlpha = opacity

    // 更新粒子坐标
    this.updateXY()

    // 绘制粒子
    this.dots.forEach(dot => {
      const { x, y, r, parallaxOffsetX, parallaxOffsetY } = dot
      ctx.save()
      ctx.beginPath()
      ctx.arc(x + parallaxOffsetX, y + parallaxOffsetY, r, 0, doublePI)
      ctx.fillStyle = dot.color
      ctx.fill()
      ctx.restore()
    })

    // 当连接范围小于 0 时，不连接线段
    if (range > 0) {
      this.connectDots()
    }

    this.requestAnimationFrame()
  }

  connectDots() {
    const { dots, ctx, lineShapeMaker } = this
    const length = dots.length

    dots.forEach((dot, i) => {
      const x = dot.x + dot.parallaxOffsetX
      const y = dot.y + dot.parallaxOffsetY

      while (++i < length) {
        const sibDot = dots[i]
        const sx = sibDot.x + sibDot.parallaxOffsetX
        const sy = sibDot.y + sibDot.parallaxOffsetY

        lineShapeMaker(x, y, sx, sy, () => {
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(sx, sy)
          ctx.strokeStyle = dot.color
          ctx.stroke()
          ctx.restore()
        })
      }
    })
  }

  updateXY() {
    const { paused, mouseX, mouseY, cw, ch } = this
    const { parallax, parallaxStrength } = this.set

    this.dots.forEach(dot => {
      // 暂停的时候，vx 和 vy 保持不变，
      // 防止自适应窗口变化时出现粒子移动
      if (!paused) {
        if (parallax) {
          // https://github.com/jnicol/particleground/blob/master/jquery.particleground.js#L279-L282
          const divisor = parallaxStrength * dot.parallaxLayer
          dot.parallaxOffsetX += (mouseX / divisor - dot.parallaxOffsetX) / 10
          dot.parallaxOffsetY += (mouseY / divisor - dot.parallaxOffsetY) / 10
        }

        dot.x += dot.vx
        dot.y += dot.vy

        let { x, y, r, parallaxOffsetX, parallaxOffsetY } = dot
        x += parallaxOffsetX
        y += parallaxOffsetY

        // 自然碰撞反向，视差事件移动反向
        if (x + r >= cw) {
          dot.vx = -abs(dot.vx)
        } else if (x - r <= 0) {
          dot.vx = abs(dot.vx)
        }

        if (y + r >= ch) {
          dot.vy = -abs(dot.vy)
        } else if (y - r <= 0) {
          dot.vy = abs(dot.vy)
        }
      }
    })
  }

  setElemOffset() {
    return (this.elemOffset =
      this.set.eventElem === document ? null : offset(this.set.eventElem))
  }

  proxyEvent(move, orientation) {
    const { eventElem } = this.set
    let orientationHandler = null

    if (orientationSupport) {
      orientationHandler = e => {
        if (this.paused || isNull(e.beta)) return

        // 转换 beta 范围 [-180, 180] 成 [-90, 90]
        orientation(Math.min(Math.max(e.beta, -90), 90), e.gamma)
      }

      on(window, 'deviceorientation', orientationHandler)
    }

    const moveHandler = e => {
      if (this.paused) return

      let left = e.pageX
      let top = e.pageY

      if (this.setElemOffset()) {
        // 动态判断祖先节点是否具有固定定位，有则使用 client 计算
        if (checkParentsProperty(eventElem, 'position', 'fixed')) {
          left = e.clientX
          top = e.clientY
        }
        left -= this.elemOffset.left
        top -= this.elemOffset.top
      }
      move(left, top)
    }

    on(eventElem, 'mousemove', moveHandler)
    this.onDestroy(() => {
      off(eventElem, 'mousemove', moveHandler)
      off(window, 'deviceorientation', orientationHandler)
    })
  }

  positionEvent() {
    const { range } = this.set

    // 性能优化
    if (range > this.cw && range > this.ch) return

    this.proxyEvent(
      // 鼠标移动事件
      (left, top) => {
        this.positionX = left
        this.positionY = top
      },
      // 陀螺仪事件
      (beta, gamma) => {
        this.positionY = (-(beta - 90) / 180) * this.ch
        this.positionX = (-(gamma - 90) / 180) * this.cw
      }
    )
  }

  parallaxEvent() {
    if (!this.set.parallax) return

    this.proxyEvent(
      (left, top) => {
        this.mouseX = left - this.cw / 2
        this.mouseY = top - this.ch / 2
      },
      (beta, gamma) => {
        // 一半高度或宽度的对应比例值
        // mouseX: - gamma / 90 * cw / 2;
        // mouseY: - beta / 90 * ch / 2;
        this.mouseX = (-gamma * this.cw) / 180
        this.mouseY = (-beta * this.ch) / 180
      }
    )
  }

  resize() {
    super.resize((scaleX, scaleY) => {
      if (this.set.range > 0) {
        this.positionX *= scaleX
        this.positionY *= scaleY
        this.mouseX *= scaleX
        this.mouseY *= scaleY
      }
    })
  }
}
