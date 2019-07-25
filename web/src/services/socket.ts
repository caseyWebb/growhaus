import autobind from 'autobind-decorator'

import { WebApiEvents, WebApiMessage, WeatherData } from '@caseywebb/growhaus'

type Handler<T> = (data: T) => void

class Socket {
  private heartbeatTimeout?: NodeJS.Timer
  private ws!: WebSocket
  private onMessageHandlers = {
    [WebApiEvents.WeatherData]: [] as Handler<WeatherData>[]
  }
  private connectionPromise: Promise<void> = Promise.resolve()

  constructor() {
    this.connect()
  }

  public async send(message: any) {
    await this.connectionPromise
    this.ws.send(message)
  }

  public on(
    eventType: WebApiEvents.WeatherData,
    handler: (data: WeatherData) => void
  ) {
    this.onMessageHandlers[eventType].push(handler)
  }

  private async connect() {
    console.log(`Attempting to connect to API server...`)
    this.connectionPromise = new Promise((resolve) => {
      this.ws = new WebSocket(`${SERVER_URL}/web`)
      this.ws.addEventListener('message', ({ data }) =>
        this.wsMessage(JSON.parse(data) as WebApiMessage)
      )
      this.ws.addEventListener('close', this.wsClose)
      this.ws.addEventListener('error', () => {
        /* noop */
      })
      this.ws.addEventListener('open', () => {
        resolve()
        console.log('Connected to API Server')
      })
    })
  }

  @autobind
  private wsClose() {
    console.log('Connection to server failed... Attempting reconnection...')
    if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout)
    setTimeout(this.connect, 3000)
  }

  @autobind
  private async wsMessage(message: WebApiMessage) {
    const handlers: any[] = this.onMessageHandlers[message.event]
    await Promise.all(handlers.map((h) => h(message)))
  }
}

export const socket = new Socket()
