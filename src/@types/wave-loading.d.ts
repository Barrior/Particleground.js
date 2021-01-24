import { CommonConfig } from './common/config'

export interface Options extends Partial<CommonConfig> {
  // [font style][font weight][font size][font family]
  // 文本样式，同css一样，必须包含 [font size] 和 [font family]
  font: string

  // 文本颜色
  color: string

  // 进度文本模板，`%d` 将被替换成取整的进度值
  formatter: string

  // 填充的背景色
  fillColor: string

  // 线条横向偏移值，距离canvas画布左边的偏移值
  // (0, 1)表示容器宽度的倍数，0 & [1, +∞)表示具体数值
  offsetLeft: number

  // 波纹纵向偏移值，波纹中点距离 Canvas 顶部的距离
  // (0, 1) 表示容器高度的倍数，0 & [1, +∞) 表示具体数值
  offsetTop: number

  // 波峰高度，(0, 1) 表示容器高度的倍数，0 & [1, +∞) 表示具体数值
  crestHeight: number

  // 波峰个数，即正弦周期个数，默认随机 [1, 0.2 * 容器宽度)
  crestCount: number

  // 波浪的运动速度
  speed: number

  // 加载到 99% 的时长，单位毫秒(ms)
  // 用时越久，越慢加载到 99%。
  duration: number

  // 加载过程的运动效果，
  // 目前支持匀速(linear)，先加速再减速(swing)，两种
  easing: 'linear' | 'swing' | 'easeInOutQuad'

  // 图形遮罩，以 https? 开头的 URL
  mask?: string
}

export type InputOptions = Omit<Options, 'offsetTop'>

export interface IElement {
  // x 坐标
  x: number
  // y 坐标
  y: number
}
