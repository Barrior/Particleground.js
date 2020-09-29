import { isFunction } from '~src/utils'

export default class Events {
  private listenerMap: {
    [eventName: string]: Function[]
  } = {}

  on(eventName: string, ...listeners: Function[]): this {
    if (!this.listenerMap[eventName]) {
      this.listenerMap[eventName] = []
    }

    for (const listener of listeners) {
      if (isFunction(listener)) {
        this.listenerMap[eventName].push(listener)
      }
    }

    return this
  }

  off(eventName?: string, listener?: Function): this {
    if (!eventName) {
      this.listenerMap = {}
    } else if (!listener) {
      this.listenerMap[eventName] = []
    } else {
      const container = this.listenerMap[eventName]
      const index = container.indexOf(listener)
      if (index !== -1) {
        container.splice(index, 1)
      }
    }
    return this
  }

  trigger(eventName: string, ...args: any[]): this {
    this.listenerMap[eventName].forEach((listener) => {
      listener(...args)
    })
    return this
  }
}
