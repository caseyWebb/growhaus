import { brightness } from './brightness'
import * as WebSocket from 'ws'

import { AgentData, Subscribable } from '@caseywebb/growhaus'

class Agent extends Subscribable implements AgentData {
  public readonly brightness: number = NaN
  public pending = false

  constructor(public name: string, private socket: WebSocket) {
    super()

    Object.defineProperty(this, 'socket', { enumerable: false })

    this.socket.on('message', (data: string) => {
      this.pending = false
      Object.assign(this, JSON.parse(data))
      this.next()
    })

    brightness.subscribe(() => this.setBrightness(brightness.current))
  }

  private setBrightness(brightness: number) {
    console.log(`Setting "${this.name}" to ${brightness}% brightness`)
    this.pending = true
    this.socket.send(
      JSON.stringify({
        event: 'brightness',
        brightness,
      })
    )
    this.next()
  }
}

class AgentRegistry extends Subscribable {
  public agents: { [k: string]: Agent } = {}

  public register(name: string, socket: WebSocket) {
    console.log('Agent registered:', name)
    const agent = new Agent(name, socket)
    this.agents[name] = agent
    agent.subscribe(this.next)
    this.next()
  }

  public unregister(name: string) {
    console.log('Agent unregistered:', name)
    delete this.agents[name]
    this.next()
  }
}

export const agents = new AgentRegistry()
