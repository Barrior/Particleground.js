export const piBy180 = Math.PI / 180
export const doublePi = Math.PI * 2
export const orientationSupport = !!window.DeviceOrientationEvent
export const funcToString = Function.prototype.toString
export const objectCtorString = funcToString.call(Object)
export const defaultCanvasWidth = 485
export const defaultCanvasHeight = 300
export const isRuntimeSupported = !!Object.defineProperty

export const regExp = {
  trimAll: /\s/g,
}
