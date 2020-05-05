class LightSchedule {
  public current = 0

  private readonly subscriptions: Array<(v: number) => void> = []

  constructor() {
    this.update()
    setInterval(() => this.update(), 60000)
  }

  public subscribe(cb: (value: number) => any) {
    this.subscriptions.push(cb)
  }

  private update() {
    this.current = LightSchedule.calculate()
    this.subscriptions.forEach((fn) => fn(this.current))
  }

  private static calculate(): number {
    const dayBegin = 7
    const dayEnd = 21
    const peakBegin = 11
    const peakEnd = 17
    const now = new Date()
    const nowH = now.getHours()
    const nowM = now.getMinutes()

    if (nowH < dayBegin || nowH > dayEnd) return 0
    if (nowH > peakBegin && nowH < peakEnd) return 100

    const transitionPeriodLengthInMinutes =
      (nowH < 12 ? peakBegin - dayBegin : dayEnd - peakEnd) * 60
    const transitionPeriodProgressInMinutes =
      (nowH - (nowH < 12 ? dayBegin : peakEnd)) * 60 + nowM
    return Math.round(
      (100 * transitionPeriodProgressInMinutes) /
        transitionPeriodLengthInMinutes
    )
  }
}

export const schedule = new LightSchedule()
