import { piBy180, regExp } from './consts'

/**
 * 包装原生 parseInt，确保输出十进制数值
 */
export function pInt(str: string) {
  return parseInt(str, 10)
}

/**
 * 包装原生 toFixed，确保输出数字而不是字符串
 */
export function toFixed(num: number | string, digits: number) {
  return parseFloat(Number(num).toFixed(digits))
}

/**
 * 移除字符串内所有空白，包括空格、空行、制表符
 */
export function trimAll(str: string) {
  return str.replace(regExp.trimAll, '')
}

/**
 * 角度转弧度
 */
export function degreesToRadians(degrees: number) {
  return degrees * piBy180
}

/**
 * 弧度转角度
 */
export function radiansToDegrees(radians: number) {
  return radians / piBy180
}

/**
 * 限制随机数的范围
 */
export function limitRandom(max: number, min: number) {
  return max === min ? max : Math.random() * (max - min) + min
}

/**
 * 获取随机速度
 */
export function speedRandom(maxSpeed: number, minSpeed: number) {
  return (
    (limitRandom(maxSpeed, minSpeed) || maxSpeed) *
    (Math.random() > 0.5 ? 1 : -1)
  )
}
