import autobind from 'autobind-decorator'

export class LightSchedule {
  private paused = false
  private pauseTimeout?: NodeJS.Timer
  private subscriptions = [] as ((brightness: number) => void)[]
  private schedule = [
    10, // midnight
    10,
    10,
    10,
    10,
    10,
    30, // 6 AM
    40,
    50,
    60,
    70,
    80,
    90,
    100, // 1 PM
    100,
    100,
    100,
    100,
    90, // 6 PM
    80,
    50,
    30,
    10,
    10,
    10
  ]

  constructor() {
    setInterval(this.next, 60 * 1000 * 60)
  }

  public pause(duration: number) {
    if (this.pauseTimeout) clearTimeout(this.pauseTimeout)
    this.paused = true
    this.pauseTimeout = setTimeout(() => {
      this.paused = false
      this.next()
    }, duration)
  }

  public set(schedule: number[]) {
    this.schedule = schedule
    this.next()
  }

  public subscribe(handler: (b: number) => void) {
    this.subscriptions.push(handler)
  }

  private getCurrentBrightness() {
    return this.schedule[new Date().getHours()]
  }

  @autobind
  private next() {
    if (!this.paused) {
      this.subscriptions.forEach((s) => s(this.getCurrentBrightness()))
    }
  }
}
