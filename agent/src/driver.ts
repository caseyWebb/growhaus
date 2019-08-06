import autobind from 'autobind-decorator'
import { Board, Led } from 'johnny-five'
import { LedOption } from 'pi-io'

export enum BoardType {
  RaspberryPi = 'pi'
}

type LedDriverConfig = {
  board: BoardType
  pin: LedOption
}

export class LedDriver {
  private readonly ready: Promise<void>

  private led!: Led

  constructor(config: LedDriverConfig) {
    this.ready = new Promise(async (resolve) => {
      console.log('Initializing GPIO...')
      const io = await LedDriver.getBoardIO(config.board)
      const board = new Board({
        repl: false,
        io
      })
      board.on('ready', () => {
        this.led = new Led(config.pin as any)
        console.log('GPIO initialized.')
        resolve()
      })
    })
  }

  @autobind
  public async setBrightness(percentage: number) {
    await this.ready
    // bound between 10% and 100%
    percentage = Math.min(Math.max(percentage, 10), 100)
    console.log(`Setting brightness to ${percentage}%`)
    this.led.on()
    this.led.brightness(255 - Math.round((percentage / 100) * 255))
  }

  private static async getBoardIO(board: BoardType) {
    switch (board) {
      case BoardType.RaspberryPi:
        const { default: PiIO } = await import('pi-io')
        return new PiIO()
      default:
        throw new Error(`Unknown board type "${board}"`)
    }
  }
}
