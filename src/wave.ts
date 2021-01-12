import { CommonConfig } from '~src/@types/common/config'
import { doublePi } from '~src/common/constants'

import { IElement, Options, StdOptions, StrNumBool } from './@types/wave'
import Base from './common/base'
import { mount } from './common/core'
import {
  calcQuantity,
  isPlainObject,
  isUndefined,
  loadImage,
  randomColor,
  randomInRange,
} from './utils'

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
] as const

type DynamicOptions = ValueOf<typeof dynamicOptions>

const stdProperties = [...dynamicOptions, 'crestCount'] as const

@mount('Wave')
export default class Wave extends Base<Options> {
  static defaultConfig: Options = {
    // 波纹个数
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

    // 波纹横向偏移值，距离 Canvas 左边缘的偏移值
    // (0, 1) 表示容器宽度的倍数，0 & [1, +∞) 表示具体数值
    offsetLeft: [],

    // 波纹纵向偏移值，波纹中点距离 Canvas 顶部的距离
    // (0, 1) 表示容器高度的倍数，0 & [1, +∞) 表示具体数值
    offsetTop: [],

    // 波峰高度，(0, 1) 表示容器高度的倍数，0 & [1, +∞) 表示具体数值
    crestHeight: [],

    // 波峰个数，即正弦周期个数，默认随机 [1, 0.2 * 容器宽度)
    crestCount: [],

    // 运动速度，默认随机 [.1, .4)
    speed: [],
  }

  protected elements!: IElement[][]

  // 波长，每个周期(2π)在 Canvas 上的实际长度
  private waveLength!: number[]

  // 遮罩图像
  private maskImage?: HTMLImageElement

  constructor(
    selector: string | HTMLElement,
    options?: Omit<Partial<Options>, 'color'>
  ) {
    super(Wave.defaultConfig, selector, options)
  }

  protected init(): void {
    this.waveLength = []
    this.optionsNormalize()
    this.loadMask()
    this.createDots()
  }

  /**
   * 标准化配置项
   */
  private optionsNormalize(): void {
    stdProperties.forEach((property) => {
      let num = this.options.num

      // 选项原始值
      const rawValue = this.options[property]

      // 选项标准值
      const stdValue: ValueOf<StdOptions> = []

      // 比例范围
      const scaleRange =
        property === 'offsetLeft' ? this.canvasWidth : this.canvasHeight

      // 将数组、字符串、数字、布尔类型等属性标准化，利于内部代码编写
      //
      // 例如 num = 3 时，
      //   crestHeight: 2或[]或[2]或[2, 2], 将标准化成: [2, 2, 2]
      //   crestHeight: 没有传值时则使用默认值，将标准化成: [x, x, x], x表示默认值
      while (num--) {
        const value = Array.isArray(rawValue) ? rawValue[num] : rawValue

        stdValue[num] = isUndefined(value)
          ? this.getOptionDefaultValue(property)
          : Wave.getOptionProcessedValue(property, value, scaleRange)

        if (property === 'crestCount') {
          this.waveLength[num] = this.canvasWidth / (stdValue[num] as number)
        }
      }

      this.options[property] = stdValue as never
    })
  }

  /**
   * 配置项缺省情况下对应的默认值
   * @param property 配置项属性
   */
  private getOptionDefaultValue(property: ValueOf<typeof stdProperties>) {
    const { canvasWidth, canvasHeight } = this
    switch (property) {
      case 'lineColor':
      case 'fillColor':
        return randomColor()
      case 'lineWidth':
        return randomInRange(2, 0.2)
      case 'offsetLeft':
        return Math.random() * canvasWidth
      case 'offsetTop':
      case 'crestHeight':
        return Math.random() * canvasHeight
      case 'crestCount':
        return randomInRange(canvasWidth / 2, 1)
      case 'speed':
        return randomInRange(0.4, 0.1)
      case 'fill':
        return false
      case 'line':
        return true
    }
  }

  /**
   * 获取配置项计算数值
   * @param property 属性
   * @param value 原始值
   * @param range 范围值
   */
  private static getOptionProcessedValue(
    property: ValueOf<typeof stdProperties>,
    value: StrNumBool,
    range: number
  ) {
    if (
      property === 'offsetTop' ||
      property === 'offsetLeft' ||
      property === 'crestHeight'
    ) {
      return calcQuantity(value as number, range)
    }
    return value
  }

  /**
   * 创建波浪线条像素点
   */
  private createDots() {
    const { canvasWidth, waveLength } = this
    let { num } = this.options

    while (num--) {
      const line = []

      // 点的 y 轴步进
      const step = doublePi / waveLength[num]

      // 创建一条线段所需的点
      for (let i = 0; i <= canvasWidth; i++) {
        line.push({
          x: i,
          y: i * step,
        })
      }

      this.elements[num] = line
    }
  }

  /**
   * 绘图
   */
  protected draw(): void {
    const { ctx, canvasWidth, canvasHeight } = this

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.globalAlpha = this.options.opacity

    ctx.save()

    if (this.maskImage) {
      // 绘制遮罩
      this.drawMask()

      // 设置图形组合模式，将波浪效果置于遮罩
      ctx.globalCompositeOperation = 'source-atop'
    }

    // 绘制波浪效果
    this.drawWaves()

    ctx.restore()

    this.requestAnimationFrame()
  }

  /**
   * 绘制遮罩，遮罩图像填充模式为 contain 且居中
   */
  private drawMask() {
    if (!this.maskImage) return

    const { ctx, canvasWidth, canvasHeight, maskImage } = this
    const imgWidth = maskImage.naturalWidth
    const imgHeight = maskImage.naturalHeight
    const imgScale = imgWidth / imgHeight

    // 图像 contain 填充模式算法
    let width = imgWidth > canvasWidth ? canvasWidth : imgWidth
    let height = imgHeight > canvasHeight ? canvasHeight : imgHeight

    if (imgWidth > imgHeight) {
      height = width / imgScale
    } else {
      width = height * imgScale
    }

    // 居中处理
    const x = (canvasWidth - width) / 2
    const y = (canvasHeight - height) / 2

    ctx.drawImage(
      this.maskImage,
      0,
      0,
      imgWidth,
      imgHeight,
      x,
      y,
      width,
      height
    )
  }

  /**
   * 绘制波浪效果
   */
  private drawWaves() {
    const { ctx, canvasWidth, canvasHeight, isPaused } = this
    const options = this.options as StdOptions & CommonConfig

    this.elements.forEach((lines, i) => {
      const crestHeight = options.crestHeight[i]
      const offsetLeft = options.offsetLeft[i]
      const offsetTop = options.offsetTop[i]
      const speed = options.speed[i]

      ctx.save()
      ctx.beginPath()

      lines.forEach((dot, j) => {
        ctx[j ? 'lineTo' : 'moveTo'](
          dot.x,
          // y = A sin ( ωx + φ ) + h
          crestHeight * Math.sin(dot.y + offsetLeft) + offsetTop
        )
        !isPaused && (dot.y -= speed)
      })

      // 填充
      if (options.fill[i]) {
        ctx.lineTo(canvasWidth, canvasHeight)
        ctx.lineTo(0, canvasHeight)
        ctx.closePath()
        ctx.fillStyle = options.fillColor[i]
        ctx.fill()
      }

      // 绘制线条边框
      if (options.line[i]) {
        ctx.lineWidth = options.lineWidth[i]
        ctx.strokeStyle = options.lineColor[i]
        ctx.stroke()
      }

      ctx.restore()
    })
  }

  /**
   * 加载遮罩图像
   * @TODO 加载错误重试
   */
  private loadMask() {
    if (!this.options.mask) return

    loadImage(this.options.mask!, (image) => {
      this.maskImage = image
    })
  }

  /**
   * 窗口尺寸调整事件
   */
  protected resizeEvent(): void {
    const props = ['offsetLeft', 'offsetTop', 'crestHeight'] as const
    const options = this.options as StdOptions

    super.resizeEvent((scaleX, scaleY) => {
      // 调整选项缩放后的值
      props.forEach((prop) => {
        const scale = prop === 'offsetLeft' ? scaleX : scaleY
        options[prop].forEach((value, i, array) => {
          array[i] = value * scale
        })
      })

      // 调整点的坐标
      this.elements.forEach((lines) => {
        lines.forEach((dot) => {
          dot.x *= scaleX
          dot.y *= scaleY
        })
      })
    })
  }

  /**
   * 更新选项值
   * @param property 选项属性
   * @param newValue 新值
   */
  private updateOptions(
    property: DynamicOptions,
    newValue?: ValueOf<Pick<Options, DynamicOptions>>
  ) {
    if (!newValue) return

    const scaleRange =
      property === 'offsetLeft' ? this.canvasWidth : this.canvasHeight
    const options = this.options as StdOptions & CommonConfig
    const isArrayType = Array.isArray(newValue)

    options[property].forEach(
      (curValue: StrNumBool, i: number, array: StrNumBool[]) => {
        let value = isArrayType ? (newValue as StrNumBool[])[i] : newValue

        value = Wave.getOptionProcessedValue(
          property,
          value as StrNumBool,
          scaleRange
        )

        // 未定义部分保持原有值
        if (isUndefined(value)) {
          value = curValue
        }

        array[i] = value
      }
    )
  }

  /**
   * 动态设置 options 选项值
   */
  setOptions(
    newOptions: Partial<Pick<Options, DynamicOptions | 'opacity'>>
  ): void {
    if (!this.options || !isPlainObject(newOptions)) {
      return
    }

    for (const property in newOptions) {
      if (Object.hasOwnProperty.call(newOptions, property)) {
        if (property === 'opacity') {
          this.options.opacity = newOptions[property] ?? 1
        } else if (dynamicOptions.indexOf(property as never) !== -1) {
          this.updateOptions(
            property as DynamicOptions,
            newOptions[property as DynamicOptions]
          )
        }
      }
    }
  }
}
