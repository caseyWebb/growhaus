import autobind from 'autobind-decorator'
import WebSocket from 'ws'

import { SERVER_URL, AGENT_NAME } from './config'
import { state } from './state'

export const Connected = Symbol()

export enum IncomingEvent {
  Brightness = 'brightness'
}

export type ManualBrightnessMessage = {
  event: IncomingEvent.Brightness
  brightness: number
  duration: number
}

/**
 * Wrapper that adds type information and deals with connection persistence
 */
class Socket {
  private ws!: WebSocket
  private heartbeatTimeout?: NodeJS.Timer
  private onMessageHandlers = {
    [Connected]: [] as (() => void)[],
    [IncomingEvent.Brightness]: [] as ((m: ManualBrightnessMessage) => void)[]
  }

  public connected = false

  constructor(private readonly url: string) {
    this.connect()
  }

  public on(eventType: typeof Connected, handler: () => void): void
  public on(
    eventType: IncomingEvent.Brightness,
    handler: (m: ManualBrightnessMessage) => void
  ): void
  public on(
    eventType: typeof Connected | IncomingEvent,
    handler: (m?: any) => void
  ) {
    this.onMessageHandlers[eventType].push(handler)
  }

  @autobind
  public sendState() {
    this.ws.send(JSON.stringify(state))
  }

  public dispose() {
    console.log('Disposing socket connection...')
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout)
    this.ws.off('close', this.wsClose)
    this.ws.close()
    console.log('Socket connection disposed.')
  }

  @autobind
  private connect() {
    console.log(`Attempting to connect to ${this.url}...`)
    this.ws = new WebSocket(this.url)

    this.ws.on('open', this.wsOpen)
    this.ws.on('ping', this.wsHeartbeat)
    this.ws.on('message', this.wsMessage)
    this.ws.on('close', this.wsClose)
    this.ws.on('error', () => {
      // noop
    })
  }

  @autobind
  private wsHeartbeat() {
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout)
    this.heartbeatTimeout = setTimeout(() => {
      console.log('Heartbeat timed out... Retrying in 1 minute...')
      this.ws.terminate()
      this.wsClose()
    }, 30000 + 1000)
  }

  @autobind
  private wsOpen() {
    console.log(`Connected to ${this.url}`)
    this.connected = true
    this.wsHeartbeat()
    this.onMessageHandlers[Connected].forEach((h) => h())
  }

  @autobind
  private wsClose() {
    console.log(
      'Connection to server failed... Attempting reconnection in 1 minute...'
    )
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout)
    this.connected = false
    setTimeout(this.connect, 60000)
  }

  @autobind
  private async wsMessage(str: string) {
    const message: ManualBrightnessMessage = JSON.parse(str)
    const handlers: any[] = this.onMessageHandlers[message.event]
    if (handlers) {
      await Promise.all(handlers.map((h) => h(message)))
    }
  }
}

export const socket = new Socket(`${SERVER_URL}/agent/${AGENT_NAME}`)
