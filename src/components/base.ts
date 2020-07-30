import commonConfig from './common-config'
import {
  merge,
  isElement,
  randomColor,
  isString,
  isFunction,
  getNumericalStyleValue,
  on,
  off,
  isPlainObject,
} from '~/src/utils'
import {
  defaultCanvasHeight,
  defaultCanvasWidth,
} from '~src/components/constants'

/**
 * 规定：
 *  defaultConfig：默认配置项，需挂载到构造函数对象上
 *
 * 对象的属性
 *  options: 参数配置
 *  options.opacity 透明度
 *  options.color: 颜色
 *  options.resize: 自适应
 *
 *  canvas: canvas对象
 *  cw: canvas宽度
 *  ch: canvas高度
 *  ctx: canvas 2d 绘图环境
 *  container: {DOM Element} 包裹canvas的容器
 *  elements: {array} 通过arc绘制的粒子对象集
 *  [element].x: 通过arc绘制的粒子的x值
 *  [element].y: 通过arc绘制的粒子的y值
 *  isPaused: {boolean} 是否暂停
 *  isCanvasRemoved: {boolean} canvas从DOM中被移除
 *
 * 对象的方法
 *  getColor：返回随机或设定好的粒子颜色
 *
 * 子类原型对象的方法
 *  init: 初始化配置或方法调用
 *  draw: 绘图函数
 *
 * 继承 Base 父类的方法
 *  pause: 暂停粒子运动
 *  open: 开启粒子运动
 *  resize: 自适应窗口，需手动调用
 *
 * 继承 Base 父类的事件
 *  onDestroy: 动画被销毁后执行的事件
 */

export default abstract class Base {
  // 合并默认值的参数
  protected readonly options!: JSONObject

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

  // 颜色工具函数，获取特效颜色
  protected readonly getColor!: () => string

  // （粒子）数据集
  protected elements: any[] = []

  // Canvas 是否从 DOM 中移除了
  protected isCanvasRemoved = false

  // 是否暂停运动了
  protected isPaused = false

  constructor(
    constructor: new (
      selector: string | HTMLElement,
      options: JSONObject
    ) => void,
    selector: string | HTMLElement,
    options?: JSONObject
  ) {
    this.container = isElement(selector)
      ? (selector as HTMLElement)
      : document.querySelector(selector as string)

    if (this.container) {
      this.options = merge({}, commonConfig, constructor.defaultConfig, options)
      this.canvas = document.createElement('canvas')
      this.ctx = this.canvas.getContext('2d')!

      this.container.innerHTML = ''
      this.container.appendChild(this.canvas)

      this.getColor = this.makeColorMethod()

      this.setCanvasDimension()
      this.observeCanvasRemoved()
      this.init()
      this.resize()
    }
  }

  // 初始化子类配置或方法
  abstract init(): void

  // 绘图函数
  abstract draw(): void

  protected makeColorMethod() {
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

  protected setDpr() {}

  protected setCanvasDimension() {
    this.cw = this.canvas.width =
      getNumericalStyleValue(this.container!, 'width') || defaultCanvasWidth
    this.ch = this.canvas.height =
      getNumericalStyleValue(this.container!, 'height') || defaultCanvasHeight
  }

  protected observeCanvasRemoved() {}

  protected requestAnimationFrame() {
    if (!this.isPaused && !this.isCanvasRemoved) {
      window.requestAnimationFrame(this.draw.bind(this))
    }
  }

  protected resizeHandler = (
    callback?: (this: Base, scaleX: number, scaleY: number) => void
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

  protected resize(
    callback?: (this: Base, scaleX: number, scaleY: number) => void
  ) {
    if (this.options.resize) {
      on(window, 'resize', this.resizeHandler.bind(this, callback))
    }
  }

  // 暂停运动
  pause(callback: (this: Base, type: 'pause') => void) {
    // 没有 container 表示实例创建失败，防止错误调用报错
    if (!this.isCanvasRemoved && !this.isPaused && this.container) {
      // 传递类型关键字（pause）供特殊使用
      isFunction(callback) && callback.call(this, 'pause')
      this.isPaused = true
    }
  }

  // 开启运动
  open(callback: (this: Base, type: 'open') => void) {
    if (!this.isCanvasRemoved && !this.isPaused && this.container) {
      isFunction(callback) && callback.call(this, 'open')
      this.isPaused = false
      this.draw()
    }
  }
}
