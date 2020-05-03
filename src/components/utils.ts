import { funcToString, objectCtorString, piBy180, regExp } from './consts'

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
 * 在指定范围内获取随机数
 */
export function randomInRange(max: number, min: number) {
  return max === min ? max : Math.random() * (max - min) + min
}

/**
 * 获取随机速度，取最大或最小速度之间的随机值，并随机赋予正负值
 */
export function randomSpeed(maxSpeed: number, minSpeed: number) {
  return (
    (randomInRange(maxSpeed, minSpeed) || maxSpeed) *
    (Math.random() > 0.5 ? 1 : -1)
  )
}

/**
 * 获取随机颜色值，返回 16 进制色值
 */
export function randomColor() {
  // http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
  // prettier-ignore
  return `#${Math.random().toString(16).slice(-6)}`
}

/**
 * 类型检测
 * @param value {*} 目标值
 * @param type {string} 预期类型
 * @returns {boolean}
 */
export function typeChecking(value: any, type: string) {
  // 直接使用 toString.call(value) 在 ie 会下报错
  return Object.prototype.toString.call(value) === type
}

/**
 * 检测 value 是否为函数
 */
export function isFunction(value: any) {
  return typeChecking(value, '[object Function]')
}

/**
 * 检测 value 是否为纯对象，即 {} 或 new Object() 创建的对象
 * 参见 https://lodash.com/docs/4.17.15#isPlainObject
 */
export function isPlainObject(value: any) {
  if (!typeChecking(value, '[object Object]')) {
    return false
  }

  // 过滤 Object.create(null)
  const proto = Object.getPrototypeOf(value)
  if (proto === null) {
    return true
  }

  // 过滤 Object.create({}) 与 new Foo()
  const Ctor =
    Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor

  return (
    typeof Ctor === 'function' &&
    Ctor instanceof Ctor &&
    funcToString.call(Ctor) === objectCtorString
  )
}

/**
 * 检测 value 是否为字符串
 */
export function isString(value: any) {
  return typeof value === 'string'
}

/**
 * 检测 value 是否为布尔值
 */
export function isBoolean(value: any) {
  return typeof value === 'boolean'
}

/**
 * 检测 value 是否为 Undefined
 */
export function isUndefined(value: any) {
  return value === undefined
}

/**
 * 检测 value 是否为 Null
 */
export function isNull(value: any) {
  return value === null
}

/**
 * 检测 value 是否为 Undefined 或者 Null
 */
export function isNil(value: any) {
  return isUndefined(value) || isNull(value)
}

/**
 * 检测 value 是否为 DOM 元素
 */
export function isElement(value: any) {
  // 1、document(nodeType: 9) 元素不能判断为 element，因为它没有很多 element 该有的属性
  // 如用 getComputedStyle 获取不到它的宽高，就会报错。
  // 2、当传入 0 的时候，不加 !! 会返回 0，而不是 Boolean 值
  return !!(value && value.nodeType === 1)
}
