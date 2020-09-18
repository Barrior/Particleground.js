import {
  getNumericalStyleValue,
  isElement,
  isFunction,
  isPlainObject,
  isString,
  merge,
  on,
  randomColor,
} from '~/src/utils'
import { CommonConfig } from '~src/@types/common/config'
import { defaultCanvasHeight, defaultCanvasWidth } from '~src/common/constants'

import commonConfig from './config'

export default abstract class Base<Options> {
  // 所有参数
  protected readonly options!: Required<Options> & CommonConfig

  // 包裹 canvas 的容器
  protected readonly container: HTMLElement | null

  // 画布
  protected readonly canvas!: HTMLCanvasElement

  // 画布宽度
  protected cw!: number

  // 画布高度
  protected ch!: number

  // 绘图环境
  protected readonly ctx!: CanvasRenderingContext2D

  // 颜色工具函数，返回随机或设定好的（粒子）颜色
  protected readonly getColor!: () => string

  // （粒子）数据集
  protected elements: any[] = []

  // Canvas 是否从 DOM 中移除了
  protected isCanvasRemoved = false

  // 是否暂停运动了
  protected isPaused = false

  protected constructor(
    defaultConfig: Options,
    selector: string | HTMLElement,
    options?: Partial<Options>
  ) {
    this.container = isElement(selector)
      ? (selector as HTMLElement)
      : document.querySelector(selector as string)

    if (this.container) {
      this.options = merge({}, commonConfig, defaultConfig, options)
      this.canvas = document.createElement('canvas')
      this.ctx = this.canvas.getContext('2d')!

      this.container.innerHTML = ''
      this.container.appendChild(this.canvas)

      // 缓存颜色获取函数，提高性能
      this.getColor = this.makeColorMethod()

      this.setCanvasDimension()
      this.observeCanvasRemoved()
      this.init()
      this.resize()
    }
  }

  /**
   * 初始化配置或方法调用
   */
  abstract init(): void

  /**
   * 绘图入口
   */
  abstract draw(): void

  /**
   * 生成 "getColor" 函数
   */
  protected makeColorMethod(): () => string {
    const { color } = this.options
    const colorLength = Array.isArray(color) ? color.length : 0

    if (isString(color)) {
      return () => color as string
    }

    if (colorLength === 0) {
      return randomColor
    }

    return () => (color as string[])[Math.floor(Math.random() * colorLength)]
  }

  /**
   * 设置设备分辨率
   */
  protected setDpr(): void {}

  /**
   * 设置画布尺寸
   */
  protected setCanvasDimension(): void {
    this.cw = this.canvas.width =
      getNumericalStyleValue(this.container!, 'width') || defaultCanvasWidth
    this.ch = this.canvas.height =
      getNumericalStyleValue(this.container!, 'height') || defaultCanvasHeight
  }

  /**
   * 监听画布从 DOM 中被移除时，做后期清理操作，如销毁事件等
   */
  protected observeCanvasRemoved() {}

  /**
   * 简单包装 window.requestAnimationFrame
   */
  protected requestAnimationFrame(): void {
    if (!this.isPaused && !this.isCanvasRemoved) {
      window.requestAnimationFrame(this.draw.bind(this))
    }
  }

  /**
   * 窗口尺寸改变处理函数，对应调整（粒子）位置
   */
  protected resizeHandler = (
    callback?: (this: this, scaleX: number, scaleY: number) => void
  ) => {
    const preCW = this.cw
    const preCH = this.ch

    // 重设画布尺寸
    this.setCanvasDimension()

    // 缩放比例
    const scaleX = this.cw / preCW
    const scaleY = this.ch / preCH

    // 自定义处理逻辑
    if (isFunction(callback)) {
      callback!.call(this, scaleX, scaleY)
    } else {
      // 通用处理逻辑，重新计算粒子坐标
      this.elements.forEach((element) => {
        if (isPlainObject(element)) {
          element.x *= scaleX
          element.y *= scaleY
        }
      })
    }

    this.isPaused && this.draw()
  }

  /**
   * 自适应窗口尺寸改变
   */
  protected resize(
    callback?: (this: this, scaleX: number, scaleY: number) => void
  ): void {
    if (this.options.resize) {
      on(window, 'resize', this.resizeHandler.bind(this, callback))
    }
  }

  /**
   * 暂停运动
   */
  pause(callback?: (this: this, type: 'pause') => void): void {
    // 没有 container 表示实例创建失败，防止错误调用报错
    if (!this.isCanvasRemoved && !this.isPaused && this.container) {
      // 传递类型关键字（pause）供特殊使用
      isFunction(callback) && callback!.call(this, 'pause')
      this.isPaused = true
    }
  }

  /**
   * 开启运动
   */
  open(callback?: (this: this, type: 'open') => void): void {
    if (!this.isCanvasRemoved && !this.isPaused && this.container) {
      isFunction(callback) && callback!.call(this, 'open')
      this.isPaused = false
      this.draw()
    }
  }

  onDestroy(...args: (() => void)[]): this {
    return this
    // 让事件支持链式操作
    // return registerListener(this, this.destructionListeners, ...args)
  }
}
