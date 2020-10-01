/**
 * 重新定义 parseInt 函数
 * TypeScript 定义 parseInt 第一个参数只能接受 string 类型，实际还可以接受 number 类型
 */
declare function parseInt(s: string | number, radix?: number): number

/**
 * 通用元素数据结构
 */
interface CommonElement {
  // x 坐标
  x: number
  // y 坐标
  y: number
}
