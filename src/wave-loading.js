const { utils, Base, mount } = JParticles
const { PI, sin, ceil } = Math
const doublePI = PI * 2
const {
  scaleValue,
  isPlainObject,
  isUndefined,
  resize,
  registerListener,
} = utils

@mount('WaveLoading')
class WaveLoading extends Base {
  static defaultConfig = {
    // [font style][font weight][font size][font family]
    // 文本样式，同css一样，必须包含 [font size] 和 [font family]
    font: 'normal 900 20px Arial',

    // 小字体样式，如：“%”
    smallFont: 'normal 900 14px Arial',

    // 小字体相对于中点向下的偏移值，
    // 细节的处理，为了让显示更好看。
    smallFontOffsetTop: 1,

    // 文本颜色
    color: '#333',

    // 填充的背景色
    fillColor: '#27C9E5',

    // 线条横向偏移值，距离canvas画布左边的偏移值
    // (0, 1)表示容器宽度的倍数，0 & [1, +∞)表示具体数值
    offsetLeft: 0,

    // 波峰高度，(0, 1)表示容器高度的倍数，0 & [1, +∞)表示具体数值
    crestHeight: 4,

    // 波纹个数，即正弦周期个数
    rippleNum: 1,

    // 波浪的运动速度
    speed: 0.3,

    // 加载到 99% 的时长，单位毫秒(ms)
    // 用时越久，越慢加载到 99%。
    duration: 5000,

    // 加载过程的运动效果，
    // 目前支持匀速(linear)，先加速再减速(swing)，两种
    easing: 'swing',
  }

  constructor(selector, options) {
    super(WaveLoading, selector, options)
  }

  init() {
    this.c.style.borderRadius = '50%'
    this.progress = 0
    this.set.offsetTop = this.ch
    this.halfCH = this.ch / 2
    this.progressListeners = []
    this.finishedListeners = []
    this.attrNormalize()
    this.createDots()
    this.draw()
  }

  attrNormalize() {
    ;['offsetLeft', 'crestHeight'].forEach(attr => {
      this.set[attr] = scaleValue(
        this.set[attr],
        attr === 'offsetLeft' ? this.cw : this.ch
      )
    })
  }

  createDots() {
    const { cw } = this
    const dots = (this.dots = [])

    // 线条波长，每个周期(2π)在canvas上的实际长度
    const rippleLength = cw / this.set.rippleNum

    // 点的y轴步进
    const step = doublePI / rippleLength

    // 一条线段所需的点
    for (let i = 0; i <= cw; i++) {
      dots.push({
        x: i,
        y: i * step,
      })
    }
  }

  draw() {
    this.calcOffsetTop()
    this.drawWave()
    this.drawText()
    this.calcProgress()

    if (this.progress <= 100) {
      this.requestAnimationFrame()
    } else {
      this.progress = 100
      this.calcOffsetTop()
      this.drawWave()
      this.drawText()
      this.finishedListeners.forEach(cb => cb())
    }
  }

  drawWave() {
    const { ctx, cw, ch } = this
    const {
      opacity,
      crestHeight,
      offsetLeft,
      offsetTop,
      fillColor,
      speed,
    } = this.set

    ctx.clearRect(0, 0, cw, ch)
    ctx.globalAlpha = opacity
    ctx.save()
    ctx.beginPath()

    this.dots.forEach((dot, i) => {
      ctx[i ? 'lineTo' : 'moveTo'](
        dot.x,

        // y = A sin ( ωx + φ ) + h
        crestHeight * sin(dot.y + offsetLeft) + offsetTop
      )
      dot.y -= speed
    })

    ctx.lineTo(cw, ch)
    ctx.lineTo(0, ch)
    ctx.closePath()
    ctx.fillStyle = fillColor
    ctx.fill()
    ctx.restore()
  }

  drawText() {
    const { ctx, cw, halfCH, progress } = this
    let { font, smallFont, color, smallFontOffsetTop } = this.set

    let percentText = '%'
    let progressText = ceil(progress)

    this.progressListeners.forEach(callback => {
      const res = callback(this.progress)
      if (!isUndefined(res)) {
        if (isPlainObject(res)) {
          progressText = res.text
          percentText = res.smallText || ''
        } else {
          progressText = res
          percentText = ''
        }
      }
    })

    ctx.font = font
    const progressWidth = ctx.measureText(progressText).width

    ctx.font = smallFont
    const percentWidth = ctx.measureText(percentText).width

    const x = (cw - progressWidth - percentWidth) / 2

    ctx.textBaseline = 'middle'
    ctx.fillStyle = color
    ctx.font = font
    ctx.fillText(progressText, x, halfCH)
    ctx.font = smallFont
    ctx.fillText(percentText, x + progressWidth, halfCH + smallFontOffsetTop)
  }

  calcProgress() {
    if (this.immediatelyComplete) {
      this.progress += this.immediatelyComplete
      this.immediatelyComplete += 0.5
      return
    }

    if (this.progress >= 99) return

    const { easing, duration } = this.set

    if (!this.startTime) {
      this.startTime = Date.now()
    }

    // x: percent Complete      percent Complete: elapsedTime / duration
    // t: current time          elapsed time: currentTime - startTime
    // b: beginning value       start value
    // c: change in value       finish value
    // d: duration              duration
    const time = Date.now() - this.startTime
    const percent = time / duration

    if (percent <= 1) {
      this.progress = JParticles.easing[easing](
        // x, t, b, c, d
        percent,
        time,
        0,
        100,
        duration
      )

      if (this.progress >= 99) {
        this.progress = 99
      }
    }
  }

  calcOffsetTop() {
    // enhance performance when the loading progress continue for 99%
    if (!this.immediatelyComplete && this.progress === 99) return

    if (this.progress === 100) {
      this.set.offsetTop = -this.set.crestHeight
    } else {
      this.set.offsetTop = ceil(
        ((100 - this.progress) / 100) * this.ch + this.set.crestHeight
      )
    }
  }

  resize() {
    resize(this, (scaleX, scaleY) => {
      ;['offsetLeft', 'offsetTop', 'crestHeight'].forEach(option => {
        this.set[option] *= option === 'offsetLeft' ? scaleX : scaleY
      })
      this.halfCH = this.ch / 2

      if (this.progress === 100) {
        this.draw()
      }
    })
  }

  setOptions(newOptions) {
    if (this.set && isPlainObject(newOptions)) {
      for (const name in newOptions) {
        if (name !== 'offsetTop' && name in this.set) {
          this.set[name] = newOptions[name]
        }
      }
    }
  }

  done() {
    if (this.set && !this.immediatelyComplete) {
      this.immediatelyComplete = 1
    }
  }

  onProgress() {
    return registerListener(this, this.progressListeners, ...arguments)
  }

  onFinished() {
    return registerListener(this, this.finishedListeners, ...arguments)
  }
}

delete WaveLoading.prototype.pause
delete WaveLoading.prototype.open
