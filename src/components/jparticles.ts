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
export function mount(name: string) {
  // tslint:disable-next-line:ban-types
  return (value: Function) => {
    Object.defineProperty(JParticles, name, {
      value,
      writable: false,
      enumerable: true,
      configurable: false,
    })
  }
}
