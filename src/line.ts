import Base from './components/base'
import { mount } from './components/jparticles'

@mount('Line')
export default class Line extends Base {
  static defaultConfig = {
    num: 6,
    color: [],
    maxWidth: 2,
    minWidth: 1,
    // 最大速度
    maxSpeed: 3,
    minSpeed: 1,
    // 运动的方向
    // x: 水平运动
    // y: 垂直运动
    // xy: 随机水平或垂直运动
    direction: 'x',
    // 线条最大倾斜角度 [0, 180], 逆时针表示
    // 3 点钟方向表示 0 度，12 点钟方向表示 90 度（即垂直），9 点钟方向表示 180 度。
    maxDegree: 135,
    minDegree: 45,
    // 点击创建线条
    createOnClick: true,
    // 创建线条的数量
    numberOfCreations: 3,
    // 移除溢出的线条
    removeOnOverflow: true,
    // 溢出补偿，让线条溢出容器多点距离（单位PX）, 取值范围：[0, +∞)
    overflowCompensation: 20,
    // 保留的线条个数，避免都被移除
    // removeOnOverflow 为 true 时生效
    reservedLines: 6,
  }

  public elements: JSONObject[] = []

  constructor(selector: string | HTMLElement, options?: JSONObject) {
    super(Line, selector, options)
  }

  init() {
    this.elements.push({
      x: 0,
      y: 0,
    })
  }

  draw() {}
}
