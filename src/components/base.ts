export default abstract class Base {
  public elements: object[] | object[][]
  private canvasRemoved = false
  private paused = false

  constructor(
    constructor: new (selector: string | HTMLElement, options: object) => void,
    selector: string | HTMLElement,
    options?: object
  ) {
    this.elements = []
    this.init()
    console.log('options: ', options)
    console.log('selector: ', selector)
    console.log('constructor: ', constructor)
  }

  abstract init(): void

  abstract draw(): void

  requestAnimationFrame() {
    if (!this.canvasRemoved && !this.paused) {
      window.requestAnimationFrame(this.draw.bind(this))
    }
  }
}
