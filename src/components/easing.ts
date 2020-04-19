const easing = {
  linear(x: number, _t: number, b: number, c: number) {
    return b + (c - b) * x
  },
  swing(x: number, t: number, b: number, c: number, d: number) {
    return easing.easeInOutQuad(x, t, b, c, d)
  },
  easeInOutQuad(_x: number, t: number, b: number, c: number, d: number) {
    // tslint:disable-next-line:no-conditional-assignment
    if ((t /= d / 2) < 1) return (c / 2) * t * t + b
    return (-c / 2) * (--t * (t - 2) - 1) + b
  },
}

export default easing
