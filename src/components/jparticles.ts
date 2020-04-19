const JParticles = (window.JParticles = {})

/**
 * 挂载特效到 JParticles 对象上
 *
 * eg:
 * @mount('Particle')
 * class Particle extend Base {}
 *
 * @param name 属性名称
 */
export function mount(name: string): (val: object) => void {
  return (value: object) => {
    Object.defineProperty(JParticles, name, {
      value,
      writable: false,
      enumerable: true,
      configurable: false,
    })
  }
}
