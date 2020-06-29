export default abstract class Base {
  public elements: any[]

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
}
