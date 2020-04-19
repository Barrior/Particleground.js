import { piBy180 } from './consts'

export function limitRandom(max: number, min: number): number {
  return max === min ? max : Math.random() * (max - min) + min
}

export function degreesToRadians(degrees: number): number {
  return degrees * piBy180
}
