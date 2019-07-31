import { nonenumerable } from 'nonenumerable'
import * as WebSocket from 'ws'

import { AgentData, Subscribable } from '@caseywebb/growhaus'

import { weather } from './weather'

class Agent extends Subscribable implements AgentData {
  public readonly brightness: number = NaN

  constructor(public name: string, private socket: WebSocket) {
    super()
    nonenumerable(this, 'socket')
    this.socket.on('message', (data) => Object.assign(this, data))
    weather.subscribe(() =>
      this.setBrightness(
        weather.current.brightness,
        weather.reloadIntervalDurationMinutes + 5
      )
    )
  }

  public setBrightness(brightness: number, duration = 5) {
    console.log(`Setting brightness on "${this.name}" to ${brightness}`)
    this.socket.send({
      event: 'brightness',
      brightness,
      duration
    })
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
