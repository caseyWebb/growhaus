import autobind from 'autobind-decorator'

class Socket {
  private heartbeatTimeout?: NodeJS.Timer
  private ws!: WebSocket
  private onMessageHandlers: { [k: string]: any } = {}
  private connectionPromise: Promise<void> = Promise.resolve()

  constructor() {
    this.connect()
  }

  public async send(message: any) {
    await this.connectionPromise
    this.ws.send(message)
  }

  private async connect() {
    console.log(`Attempting to connect to API server...`)
    this.connectionPromise = new Promise((resolve) => {
      this.ws = new WebSocket('ws://localhost:3000/web')
      this.ws.addEventListener('message', this.wsMessage)
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
  private async wsMessage(message: any) {
    const handlers: any[] = this.onMessageHandlers[message.event]
    await Promise.all(handlers.map((h) => h(message)))
  }
}

export const socket = new Socket()
