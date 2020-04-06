export default class Base {
  constructor(constructor, selector, options) {
    // 构建任务自动添加 runtimeSupport 变量，
    // 即不支持 Object.defineProperty 的浏览器和 IE8 将不支持创建特效
    if (
      runtimeSupport &&
      (this.container = isElement(selector)
        ? selector
        : doc.querySelector(selector))
    ) {
      this.set = extend(
        true,
        {},
        JParticles.commonConfig,
        constructor.defaultConfig,
        options
      )
      this.c = doc.createElement('canvas')
      this.ctx = this.c.getContext('2d')
      this.paused = false

      setCanvasWH(this)

      this.container.innerHTML = ''
      this.container.appendChild(this.c)

      this.color = generateColor(this.set.color)

      this.observeCanvasRemoved()
      this.init()
      this.resize()
    }
  }

  requestAnimationFrame() {
    if (!this.canvasRemoved && !this.paused) {
      win.requestAnimationFrame(this.draw.bind(this))
    }
  }

  observeCanvasRemoved() {
    this.destructionListeners = []
    observeElementRemoved(this.c, () => {
      // 当 Canvas 从 DOM 中被移除
      // 1、停止 requestAnimationFrame，避免性能损耗
      this.canvasRemoved = true

      // 2、移除外在事件
      if (this._resizeHandler) {
        off(win, 'resize', this._resizeHandler)
      }

      // 3、触发销毁回调事件
      this.destructionListeners.forEach(callback => {
        callback()
      })
    })
  }

  onDestroy() {
    // 让事件支持链式操作
    return registerListener(this, this.destructionListeners, ...arguments)
  }

  // 暂停粒子运动
  pause(callback) {
    // 没有 set 表示实例创建失败，防止错误调用报错
    if (!this.canvasRemoved && this.set && !this.paused) {
      // 传递 pause 关键字供特殊使用
      isFunction(callback) && callback.call(this, 'pause')
      this.paused = true
    }
  }

  // 开启粒子运动
  open(callback) {
    if (!this.canvasRemoved && this.set && this.paused) {
      isFunction(callback) && callback.call(this, 'open')
      this.paused = false
      this.draw()
    }
  }

  // 自适应窗口，重新计算粒子坐标
  resize(callback) {
    if (this.set.resize) {
      this._resizeHandler = () => {
        const oldCW = this.cw
        const oldCH = this.ch

        // 重新设置 Canvas 宽高
        setCanvasWH(this)

        // 计算比例
        const scaleX = this.cw / oldCW
        const scaleY = this.ch / oldCH

        // 坐标重新赋值，对于常规逻辑
        if (isArray(this.dots)) {
          this.dots.forEach(v => {
            if (isPlainObject(v)) {
              v.x *= scaleX
              v.y *= scaleY
            }
          })
        }

        // 自定义逻辑
        if (isFunction(callback)) {
          callback.call(this, scaleX, scaleY)
        }

        this.paused && this.draw()
      }
      on(win, 'resize', this._resizeHandler)
    }
  }
}
