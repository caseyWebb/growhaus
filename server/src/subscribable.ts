import autobind from 'autobind-decorator'

export abstract class Subscribable {
  private subscriptions: ((data: this) => void)[] = []

  constructor() {
    this.next()
  }

  public subscribe(handler: (data: this) => void) {
    this.subscriptions.push(handler)
    return {
      dispose: () => {
        const i = this.subscriptions.indexOf(handler)
        if (i > -1) this.subscriptions.splice(i, 1)
      }
    }
  }

  @autobind
  protected next() {
    this.subscriptions.forEach((s) => s(this))
  }
}
