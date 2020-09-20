const JParticles = (window.JParticles = {})

// requestAnimationFrame 兼容处理
window.requestAnimationFrame = ((win) => {
  return (
    win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    win.mozRequestAnimationFrame ||
    function (fn: TimerHandler) {
      win.setTimeout(fn, 1000 / 60)
    }
  )
})(window)

/**
 * 挂载特效到 JParticles 对象上
 *
 * eg:
 * @mount('Particle')
 * class Particle extend Base {}
 *
 * @param name 属性名称
 */
export function mount(name: string) {
  return (value: Function) => {
    Object.defineProperty(JParticles, name, {
      value,
      writable: false,
      enumerable: true,
      configurable: false,
    })
  }
}
