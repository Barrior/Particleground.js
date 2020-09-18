import { piBy180, regExp } from '~src/common/constants'

/**
 * 包装原生 parseInt，确保输出十进制数值
 */
export function pInt(s: string | number, radix = 10): number {
  return parseInt(s, radix)
}

/**
 * 包装原生 toFixed，确保输出数字而不是字符串
 */
export function toFixed(num: number | string, digits: number): number {
  return parseFloat(Number(num).toFixed(digits))
}

/**
 * 移除字符串内所有空白，包括空格、空行、制表符
 */
export function trimAll(str: string): string {
  return str.replace(regExp.trimAll, '')
}

/**
 * 角度转弧度
 */
export function degreesToRadians(degrees: number): number {
  return degrees * piBy180
}

/**
 * 弧度转角度
 */
export function radiansToDegrees(radians: number): number {
  return radians / piBy180
}

/**
 * 在指定范围内获取随机数
 */
export function randomInRange(max: number, min: number): number {
  return max === min ? max : Math.random() * (max - min) + min
}

/**
 * 获取随机速度，取最大或最小速度之间的随机值，并随机赋予正负值
 */
export function randomSpeed(maxSpeed: number, minSpeed: number): number {
  return (
    (randomInRange(maxSpeed, minSpeed) || maxSpeed) *
    (Math.random() > 0.5 ? 1 : -1)
  )
}

/**
 * 获取随机颜色值，返回 16 进制色值
 */
export function randomColor(): string {
  // http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
  // prettier-ignore
  return `#${Math.random().toString(16).slice(-6)}`
}

/**
 * 根据范围值计算数值
 * @param value  原始值，(0, 1)表示范围值的倍数，0 & [1, +∞)表示具体数值
 * @param range  范围值
 */
export function calcNumberValue(value: number, range: number): number {
  return value > 0 && value < 1 ? value * range : value
}

/**
 * 深拷贝，浅拷贝请使用 Object.assign 或 ECMAScript 扩展运算符
 */
export function merge(...objects: any[]): any {
  return objects[0]
}
