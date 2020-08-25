import { Element, Options } from './@types/line'
import Base from './common/base'
import { mount } from './common/jparticles'

@mount('Line')
export default class Line extends Base<Partial<Options>> {
  static defaultConfig: Options = {
    num: 6,
    maxWidth: 2,
    minWidth: 1,
    maxSpeed: 3,
    minSpeed: 1,
    maxDegree: 135,
    minDegree: 45,
    createOnClick: true,
    numberOfCreations: 3,
    removeOnOverflow: true,
    overflowCompensation: 20,
    reservedLines: 6,
  }

  public elements: Element[] = []

  constructor(selector: string | HTMLElement, options?: Partial<Options>) {
    super(Line.defaultConfig, selector, options)
  }

  init() {
    this.elements.push({
      x: 0,
      y: 0,
    })
  }

  draw() {}
}
