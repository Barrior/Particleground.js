/**
 * 获取 interface 或【类数组】的类型值
 */
type ValueOf<T> = T extends ArrayLike<any> ? T[number] : T[keyof T]
