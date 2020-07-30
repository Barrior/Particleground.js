/**
 * 重新定义 parseInt 函数
 * TypeScript 定义 parseInt 第一个参数只能接受 string 类型，实际还可以接受 number 类型
 */
declare function parseInt(s: string | number, radix?: number): number

/**
 * 定义基础类型集
 * Reference: https://developer.mozilla.org/en-US/docs/Glossary/Primitive
 */
type Primitive = string | number | boolean | null | undefined | bigint | symbol

/**
 * 定义 JSON 值
 * Reference: https://github.com/microsoft/TypeScript/issues/3496#issuecomment-128553540
 */
type JSONValue = Primitive | JSONObject | JSONArray

/**
 * 定义以纯对象开始的 JSON 类型
 */
interface JSONObject {
  [key: string]: JSONValue
}

/**
 * 定义以数组开始的 JSON 类型
 */
type JSONArray = Array<JSONValue>
