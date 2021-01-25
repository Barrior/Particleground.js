import { CommonConfig } from './@types/common/config'
import { IElement, InputOptions, Options } from './@types/wave-loading'
import { doublePi, EVENT_NAMES_WAVE_LOADING } from './common/constants'
import { mount } from './common/core'
import easing from './common/easing'
import Mask from './common/mask'
import { calcQuantity, isPlainObject } from './utils'

// 仅允许 opacity 和以下选项动态设置
const dynamicOptions = [
  'opacity',
  'font',
  'color',
  'formatter',
  'fillColor',
  'offsetLeft',
  'crestHeight',
  'speed',
  'mask',
] as const

export type DynamicOptions = ValueOf<typeof dynamicOptions>

@mount('WaveLoading')
class WaveLoading extends Mask<InputOptions> {
  static defaultConfig: InputOptions = {
    // [font style][font weight][font size][font family]
    // 文本样式，同css一样，必须包含 [font size] 和 [font family]
    font: 'normal 900 20px Arial',

    // 文本颜色
    color: '#333',

    // 进度文本模板
    formatter: 'loading...%d%',

    // 填充的背景色
    fillColor: '#27C9E5',

    // 画布外边框圆角
    borderRadius: '50%',

    // 线条横向偏移值，距离canvas画布左边的偏移值
    // (0, 1)表示容器宽度的倍数，0 & [1, +∞)表示具体数值
    offsetLeft: 0,

    // 波峰高度，(0, 1)表示容器高度的倍数，0 & [1, +∞)表示具体数值
    crestHeight: 4,

    // 波纹个数，即正弦周期个数
    crestCount: 1,

    // 波浪的运动速度
    speed: 0.3,

    // 加载到 99% 的时长，单位毫秒(ms)
    // 用时越久，越慢加载到 99%。
    duration: 5000,

    // 加载过程的运动效果，
    // 目前支持匀速(linear)，先加速再减速(swing)，两种
    easing: 'swing',
  }

  protected readonly options!: Options & CommonConfig

  protected elements!: IElement[]

  // 当前进度
  private progress!: number

  // 画布半高
  private halfCH!: number

  // 是否立即完成
  private isCompletedImmediately = false

  // 立即完成时的进度步进值
  private fastStepValue = 1

  // easing 动画开始时间
  private startTime?: number

  constructor(selector: string | HTMLElement, options?: Partial<InputOptions>) {
    super(WaveLoading.defaultConfig, selector, options)
  }

  protected init() {
    this.canvas.style.borderRadius = this.options.borderRadius
    this.progress = 0
    this.options.offsetTop = this.canvasHeight
    this.halfCH = this.canvasHeight / 2
    this.optionsNormalize()
    this.createDots()
    this.loadMaskImage()
  }

  /**
   * 选项参数标准化
   */
  private optionsNormalize() {
    const options = ['offsetLeft', 'crestHeight'] as const
    options.forEach((property) => {
      this.options[property] = calcQuantity(
        this.options[property],
        property === 'offsetLeft' ? this.canvasWidth : this.canvasHeight
      )
    })
  }

  /**
   * 创建波浪线条像素点
   */
  private createDots() {
    // 线条波长，每个周期(2π)在 canvas 上的实际长度
    const waveLength = this.canvasWidth / this.options.crestCount

    // 点的y轴步进
    const step = doublePi / waveLength

    // 一条线段所需的点
    for (let i = 0; i <= this.canvasWidth; i++) {
      this.elements.push({
        x: i,
        y: i * step,
      })
    }
  }

  /**
   * 计算进度，绘制
   */
  protected draw() {
    this.eventEmitter.trigger(EVENT_NAMES_WAVE_LOADING.PROGRESS, this.progress)
    this.calcProgress()

    if (this.progress < 100) {
      this.drawingCore()
      this.requestAnimationFrame()
    } else {
      this.progress = 100
      this.drawingCore()
      this.eventEmitter.trigger(EVENT_NAMES_WAVE_LOADING.FINISHED)
    }
  }

  /**
   * 绘制图案
   */
  private drawingCore() {
    this.calcOffsetTop()
    this.clearCanvas()

    this.ctx.save()
    this.drawMask()
    this.drawWave()
    this.drawText()
    this.ctx.restore()
  }

  /**
   * 绘制波纹
   */
  private drawWave() {
    const { ctx, canvasWidth, canvasHeight } = this
    const {
      crestHeight,
      offsetLeft,
      offsetTop,
      fillColor,
      speed,
    } = this.options

    ctx.save()

    ctx.beginPath()
    this.elements.forEach((dot, i) => {
      ctx[i ? 'lineTo' : 'moveTo'](
        dot.x,

        // y = A sin ( ωx + φ ) + h
        crestHeight * Math.sin(dot.y + offsetLeft) + offsetTop
      )
      dot.y -= speed
    })
    ctx.lineTo(canvasWidth, canvasHeight)
    ctx.lineTo(0, canvasHeight)
    ctx.closePath()

    ctx.fillStyle = fillColor
    ctx.fill()
    ctx.restore()
  }

  /**
   * 绘制进度文本
   */
  private drawText() {
    const { ctx, canvasWidth, halfCH, progress } = this
    const { font, formatter, color } = this.options

    // 替换文本模板真实值
    const text = formatter.replace(/%d/g, String(Math.floor(progress)))

    ctx.save()
    ctx.font = font

    const textWidth = ctx.measureText(text).width
    const x = (canvasWidth - textWidth) / 2

    ctx.textBaseline = 'middle'
    ctx.fillStyle = color
    ctx.font = font
    ctx.fillText(text, x, halfCH)
    ctx.restore()
  }

  /**
   * 计算进度值
   */
  private calcProgress() {
    // 立即完成逻辑，采用快速步进值计算进度
    if (this.isCompletedImmediately) {
      this.progress += this.fastStepValue
      this.fastStepValue += 0.5
      return
    }

    // 悬停 99% 时，跳出计算，减少性能损耗
    if (this.progress >= 99.99) return

    if (!this.startTime) {
      this.startTime = Date.now()
    }

    // x: percent complete      percent complete: elapsedTime / duration
    // t: elapsed time          elapsed time: currentTime - startTime
    // b: beginning value       start value
    // c: change in value       finish value
    // d: duration              duration
    const time = Date.now() - this.startTime
    const percent = time / this.options.duration

    if (percent <= 1) {
      this.progress = easing[this.options.easing](
        // x, t, b, c, d
        percent,
        time,
        0,
        100,
        this.options.duration
      )

      // 防止 progress 超出 100
      if (this.progress >= 99.99) {
        this.progress = 99.99
      }
    }
  }

  /**
   * 根据进度计算波纹 offsetTop 值
   */
  private calcOffsetTop() {
    // 退出以提高性能
    if (!this.isCompletedImmediately && this.progress === 99) return

    if (this.progress === 100) {
      this.options.offsetTop = -this.options.crestHeight
    } else {
      this.options.offsetTop = Math.ceil(
        ((100 - this.progress) / 100) * this.canvasHeight +
          this.options.crestHeight
      )
    }
  }

  /**
   * 窗口尺寸调整事件
   */
  protected resizeEvent() {
    super.resizeEvent((scaleX, scaleY) => {
      const options = ['offsetLeft', 'offsetTop', 'crestHeight'] as const
      options.forEach((option) => {
        this.options[option] *= option === 'offsetLeft' ? scaleX : scaleY
      })
      this.halfCH = this.canvasHeight / 2

      if (this.progress === 100) {
        this.draw()
      }
    })
  }

  /**
   * 方法：动态设置属性值
   */
  setOptions(newOptions: Partial<Pick<Options, DynamicOptions>>) {
    if (!this.options || !isPlainObject(newOptions)) {
      return
    }

    for (const property in newOptions) {
      const prop = property as DynamicOptions
      if (
        Object.hasOwnProperty.call(newOptions, prop) &&
        dynamicOptions.indexOf(prop) !== -1
      ) {
        this.options[prop] = newOptions[prop] as never

        if (prop === 'mask') {
          this.loadMaskImage()
        }
      }
    }

    this.optionsNormalize()
  }

  /**
   * 方法：让进度立即加载完成
   */
  done() {
    if (this.options && !this.isCompletedImmediately) {
      this.isCompletedImmediately = true
    }
  }

  /**
   * 事件：进度每次改变的时候触发
   */
  onProgress(...args: Array<(progress: number) => void>) {
    this.eventEmitter.on(EVENT_NAMES_WAVE_LOADING.PROGRESS, ...args)
    return this
  }

  /**
   * 事件：进度加载到 100% 后触发
   */
  onFinished(...args: Array<() => void>) {
    this.eventEmitter.on(EVENT_NAMES_WAVE_LOADING.FINISHED, ...args)
    return this
  }
}

delete WaveLoading.prototype.pause
delete WaveLoading.prototype.open
