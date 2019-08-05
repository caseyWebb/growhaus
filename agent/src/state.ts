import autobind from 'autobind-decorator'
import { Subscribable } from '@caseywebb/growhaus'

export class AgentState extends Subscribable {
  public readonly brightness: number = 100

  @autobind
  public setBrightness(brightness: number) {
    Object.assign(this, { brightness })
    this.next()
  }
}
