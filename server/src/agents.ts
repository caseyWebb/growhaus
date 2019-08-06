import autobind from 'autobind-decorator'
import * as WebSocket from 'ws'

import { AgentData, Subscribable } from '@caseywebb/growhaus'

import { weather } from './weather'

class Agent extends Subscribable implements AgentData {
  public readonly brightness: number = NaN

  constructor(public name: string, private socket: WebSocket) {
    super()

    this.socket.on('message', (data: string) =>
      Object.assign(this, JSON.parse(data))
    )

    this.setBrightnessViaWeather()
    weather.subscribe(this.setBrightnessViaWeather)
  }

  private setBrightness(brightness: number, duration = 5) {
    console.log(`Setting "${this.name}" to ${brightness}% brightness`)
    this.socket.send(
      JSON.stringify({
        event: 'brightness',
        brightness,
        duration
      })
    )
    this.next()
  }

  @autobind
  private setBrightnessViaWeather() {
    this.setBrightness(
      weather.current.brightness,
      weather.reloadIntervalDurationMinutes
    )
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
