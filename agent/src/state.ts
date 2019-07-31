import { Subscribable } from '@caseywebb/growhaus'

export class AgentState extends Subscribable {
  public readonly brightness: number = 100

  public setBrightness(brightness: number) {
    Object.assign(this, { brightness })
    this.next()
  }
}
