import autobind from 'autobind-decorator'
import WebSocket from 'ws'

export enum IncomingEvent {
  Brightness = 'brightness',
  OfflineSchedule = 'schedule'
}

export type ManualBrightnessMessage = {
  event: IncomingEvent.Brightness
  brightness: number
  duration: number
}

export type OfflineScheduleMessage = {
  event: IncomingEvent.OfflineSchedule
  schedule: number[]
}

/**
 * Wrapper that adds type information and deals with connection persistence
 */
export class Socket {
  private ws!: WebSocket
  private heartbeatTimeout?: NodeJS.Timer
  private onMessageHandlers = {
    [IncomingEvent.OfflineSchedule]: [] as ((
      m: OfflineScheduleMessage
    ) => void)[],
    [IncomingEvent.Brightness]: [] as ((m: ManualBrightnessMessage) => void)[]
  }

  constructor(private readonly url: string) {}

  public on(
    eventType: IncomingEvent.OfflineSchedule,
    handler: (m: OfflineScheduleMessage) => void
  ): void
  public on(
    eventType: IncomingEvent.Brightness,
    handler: (m: ManualBrightnessMessage) => void
  ): void
  public on(eventType: IncomingEvent, handler: (m?: any) => void) {
    this.onMessageHandlers[eventType].push(handler)
  }

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
    this.wsHeartbeat()
  }

  @autobind
  private wsClose() {
    console.log(
      'Connection to server failed... Attempting reconnection in 1 minute...'
    )
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout)
    setTimeout(this.connect, 60000)
  }

  @autobind
  private async wsMessage(
    message: ManualBrightnessMessage | OfflineScheduleMessage
  ) {
    const handlers: any[] = this.onMessageHandlers[message.event]
    await Promise.all(handlers.map((h) => h(message)))
  }
}
