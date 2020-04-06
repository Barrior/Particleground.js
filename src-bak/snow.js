const { utils, Base, mount } = JParticles
const { random, abs, PI, max } = Math
const doublePI = PI * 2
const { pInt, limitRandom, calcSpeed } = utils

@mount('Snow')
class Snow extends Base {
  static defaultConfig = {
    // 每次随机创建的雪花数量（最多）
    num: 6,
    color: '#fff',
    maxR: 6.5,
    minR: 0.5,
    maxSpeed: 0.6,
    minSpeed: 0.1,
    // 左右摇摆
    swing: true,
    // 摇摆时间间隔
    swingInterval: 2000,
    // 到达时间间隔后，摇摆几率，[0, 1]
    swingProbability: 0.06,
  }

  constructor(selector, options) {
    super(Snow, selector, options)
  }

  init() {
    this.dots = []
    this.createDots()
    this.draw()
  }

  snowShape() {
    const { maxR, minR, maxSpeed, minSpeed } = this.set
    const r = limitRandom(maxR, minR)

    return {
      r,
      x: random() * this.cw,
      y: -r,
      vx: calcSpeed(maxSpeed, minSpeed),

      // r 越大，设置垂直速度越快，这样比较有近快远慢的层次效果
      vy: abs(r * calcSpeed(maxSpeed, minSpeed)),
      color: this.color(),
      swingAt: Date.now(),
    }
  }

  createDots() {
    // 随机创建雪花
    let count = max(0, pInt(random() * this.set.num))
    while (count--) {
      this.dots.push(this.snowShape())
    }
  }

  draw() {
    const { ctx, cw, ch, paused } = this
    const { opacity, maxR, swing, swingInterval, swingProbability } = this.set

    ctx.clearRect(0, 0, cw, ch)
    ctx.globalAlpha = opacity

    this.dots.forEach((dot, i, array) => {
      const { x, y, r } = dot

      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, r, 0, doublePI)
      ctx.fillStyle = dot.color
      ctx.fill()
      ctx.restore()

      if (!paused) {
        dot.x += dot.vx
        dot.y += dot.vy

        // 反方向飘落，根据一定的几率
        if (
          swing &&
          Date.now() - dot.swingAt > swingInterval &&
          // 半径越小，摆动几率越小
          random() < (r / maxR) * swingProbability
        ) {
          dot.swingAt = Date.now()
          dot.vx *= -1
        }

        // 雪花从侧边出去，删除再添加
        if (x < 0 || x - r > cw) {
          array.splice(i, 1, this.snowShape())

          // 雪花从底部出去，删除
        } else if (y - r > ch) {
          array.splice(i, 1)
        }
      }
    })

    // 添加雪花
    if (!paused && random() > 0.9) {
      this.createDots()
    }

    this.requestAnimationFrame()
  }
}
