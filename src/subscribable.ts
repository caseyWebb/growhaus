type Subscription = { dispose: () => void }

export abstract class Subscribable {
  private subscriptions: ((data: this) => void)[] = []

  constructor() {
    Object.defineProperty(this, 'subscriptions', {
      enumerable: false,
    })
    this.next()
  }

  public subscribe(handler: (data: this) => void): Subscription {
    this.subscriptions.push(handler)
    return {
      dispose: () => {
        const i = this.subscriptions.indexOf(handler)
        if (i > -1) this.subscriptions.splice(i, 1)
      },
    }
  }

  protected next(): void {
    this.subscriptions.forEach((s) => s(this))
  }
}
