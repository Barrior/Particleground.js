const easing = {
  linear(x, t, b, c) {
    return b + (c - b) * x
  },
  swing() {
    return easing.easeInOutQuad(...arguments)
  },
  easeInOutQuad(x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t + b
    return (-c / 2) * (--t * (t - 2) - 1) + b
  },
}

export default easing
