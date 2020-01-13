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
    maxSpeed: 2,
    minSpeed: 0.5,
    // 运动的方向
    // direction: 'x', // x, y, xy
    // 倾斜角度 (0, 180), 90° 表示垂直
    maxDegree: 179,
    minDegree: 1,
    // 点击创建线条
    createOnClick: true,
    // 创建线条的数量
    numberOfCreation: 1,
    // 移除溢出线条
    removeOnOverflow: true,
    // 保留的线条个数，避免都被溢出移除
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

  createLines(number, x) {
    const { maxWidth, minWidth, maxSpeed, minSpeed } = this.set
    number = 1
    while (number--) {
      x = isUndefined(x) ? Math.random() * this.cw : x
      x = number === 1 ? 300 : 400
      this.dots.push({
        x,
        width: limitRandom(maxWidth, minWidth),
        color: this.color(),
        speed: calcSpeed(maxSpeed, minSpeed),
        degree: 0,
      })
    }
  }

  createLinesOnClick() {
    const handleClick = event => {
      if (this.paused) return
      const x = event.pageX - offset(this.c).left
      this.createLines(this.set.numberOfCreation, x)
    }
    this.c.addEventListener('click', handleClick)
    this.onDestroy(() => {
      this.c.removeEventListener('click', handleClick)
    })
  }

  draw() {
    const { ctx, cw, ch, paused } = this
    const { opacity, removeOnOverflow, reservedLines } = this.set

    ctx.clearRect(0, 0, cw, ch)
    ctx.globalAlpha = opacity

    const hypotenuse = calcHypotenuse(cw, ch)
    const lineLength = hypotenuse * 10

    // let direction = 'y'

    this.dots.forEach((line, i) => {
      // line.x = this.cw / 2

      // 3 点钟方向为 0 度，逆时针旋转，9点方向为 180 度
      const radian = degreeToRadian(360 - 5)
      const subtense = (this.ch / 2) * Math.tan(radian)
      const x1 = line.x + subtense
      const x2 = line.x - subtense

      // console.log('subtense: ', subtense)
      // console.log('line.x: ', line.x)
      // console.log('x1: ', x1)
      // console.log('x2: ', x2)

      ctx.save()
      ctx.beginPath()

      // if (direction === 'x') {
      // } else if (direction === 'y') {
      // }

      ctx.translate(line.x, this.ch / 2)
      ctx.rotate(radian)
      ctx.moveTo(0, -lineLength)
      ctx.lineTo(0, lineLength)
      ctx.lineWidth = line.width
      ctx.strokeStyle = line.color
      ctx.stroke()
      ctx.closePath()
      ctx.restore()
      ctx.fillRect(line.x, this.ch / 2, 20, 20)

      if (!paused) {
        line.x += line.speed
      }

      let overflow = false
      let isLeftOverflow = false

      if (line.speed < 0) {
        if (x1 < 0) {
          overflow = true
          isLeftOverflow = true
        }
      } else {
        if (x2 > cw) {
          overflow = true
        }
      }

      if (overflow) {
        if (removeOnOverflow && this.dots.length > reservedLines) {
          // 溢出移除
          this.dots.splice(i, 1)
        } else {
          // 溢出反向，确定方向，防止缩放窗口时，值取错方向
          line.speed = Math.abs(line.speed) * (isLeftOverflow ? 1 : -1)
        }
      }
    })

    // this.requestAnimationFrame()
  }
}
