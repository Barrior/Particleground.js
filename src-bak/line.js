const { utils, Base, mount } = JParticles
const { limitRandom, calcSpeed, offset, isUndefined, degreeToRadian } = utils

function calcHypotenuse(a, b) {
  return Math.sqrt(a * a + b * b)
}

@mount('Line')
class Line extends Base {
  static defaultConfig = {
    num: 6,
    color: [],
    maxWidth: 2,
    minWidth: 1,
    // 最大速度
    maxSpeed: 3,
    minSpeed: 1,
    // 运动的方向
    // x: 水平运动
    // y: 垂直运动
    // xy: 随机水平或垂直运动
    direction: 'x',
    // 线条最大倾斜角度 [0, 180], 逆时针表示
    // 3 点钟方向表示 0 度，12 点钟方向表示 90 度（即垂直），9 点钟方向表示 180 度。
    maxDegree: 135,
    minDegree: 45,
    // 点击创建线条
    createOnClick: true,
    // 创建线条的数量
    numberOfCreations: 3,
    // 移除溢出的线条
    removeOnOverflow: true,
    // 溢出补偿，让线条溢出容器多点距离（单位PX）, 取值范围：[0, +∞)
    overflowCompensation: 20,
    // 保留的线条个数，避免都被移除
    // removeOnOverflow 为 true 时生效
    reservedLines: 6,
  }

  constructor(selector, options) {
    super(Line, selector, options)
  }

  init() {
    this.dots = []
    this.createLines(this.set.num)
    this.draw()

    if (this.set.createOnClick) {
      this.createLinesOnClick()
    }
  }

  createLines(number, position) {
    const {
      maxWidth,
      minWidth,
      maxSpeed,
      minSpeed,
      maxDegree,
      minDegree,
    } = this.set
    while (number--) {
      const x = isUndefined(position) ? Math.random() * this.cw : position
      this.dots.push({
        x,
        width: limitRandom(maxWidth, minWidth),
        color: this.color(),
        speed: calcSpeed(maxSpeed, minSpeed),

        // 限制角度取值范围为 [-180, 180]
        degree: limitRandom(maxDegree, minDegree) % 180,
      })
    }
  }

  createLinesOnClick() {
    const handleClick = event => {
      if (this.paused) return
      const x = event.pageX - offset(this.c).left
      this.createLines(this.set.numberOfCreations, x)
    }
    this.c.addEventListener('click', handleClick)
    this.onDestroy(() => {
      this.c.removeEventListener('click', handleClick)
    })
  }

  draw() {
    const { ctx, cw, ch } = this
    const {
      opacity,
      removeOnOverflow,
      overflowCompensation,
      reservedLines,
    } = this.set

    ctx.clearRect(0, 0, cw, ch)
    ctx.globalAlpha = opacity

    // 以 Canvas 三角形计算出来的最长边的 10 倍长度作为线段的半长
    const hypotenuse = calcHypotenuse(cw, ch)
    const lineLength = hypotenuse * 10

    // 溢出补偿
    const OC = Math.max(0, overflowCompensation)

    this.dots.forEach((line, i) => {
      // 逆时针表示，3 点钟方向表示 0 度，12 点钟方向表示 90 度（即垂直），9 点钟方向表示 180 度。
      const radian = degreeToRadian(-line.degree)

      // 可视区内角度邻边的长度
      let adjacentSide = 0
      if (![-180, -90, 0, 90, 180].includes(line.degree)) {
        adjacentSide = Math.abs(this.ch / 2 / Math.tan(radian))
      }

      ctx.save()
      ctx.beginPath()

      // 通过 translate 将线段移动到指定位置
      ctx.translate(line.x, this.ch / 2)
      ctx.rotate(radian)

      // 在 (0, 0) 位置横向描绘线段
      ctx.moveTo(-lineLength, 0)
      ctx.lineTo(lineLength, 0)

      // 设置线条宽度和颜色
      ctx.lineWidth = line.width
      ctx.strokeStyle = line.color

      ctx.stroke()
      ctx.closePath()
      ctx.restore()

      if (!this.paused) {
        line.x += line.speed
      }

      let isOverflow = false
      let isOverflowOnLeft = false

      // 溢出补偿，让溢出多偏移一点才反向
      if (line.x + adjacentSide + line.width + OC < 0) {
        isOverflow = true
        isOverflowOnLeft = true
      } else if (line.x > this.cw + adjacentSide + line.width + OC) {
        isOverflow = true
      }

      if (isOverflow) {
        if (removeOnOverflow && this.dots.length > reservedLines) {
          // 溢出移除
          this.dots.splice(i, 1)
        } else {
          // 溢出反向
          line.speed = Math.abs(line.speed) * (isOverflowOnLeft ? 1 : -1)
        }
      }
    })

    this.requestAnimationFrame()
  }
}
