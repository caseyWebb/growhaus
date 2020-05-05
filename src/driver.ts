import { Board, Led } from 'johnny-five'
import { default as PiIO, LedOption } from 'pi-io'

export const DRIVER_PWM_PIN: LedOption = 'GPIO18'

class LedDriver {
  private readonly ready: Promise<void>

  private led!: Led

  constructor() {
    this.ready = new Promise(async (resolve) => {
      console.log('Initializing GPIO...')
      const io = new PiIO()
      const board = new Board({
        repl: false,
        io,
      })
      board.on('ready', () => {
        this.led = new Led(DRIVER_PWM_PIN as any)
        console.log('GPIO initialized.')
        resolve()
      })
    })
  }

  public async setBrightness(percentage: number) {
    await this.ready
    percentage = Math.min(Math.max(percentage, 0), 100)
    console.log(`Setting brightness to ${percentage}%`)
    this.led.on()
    this.led.brightness(255 - Math.round((percentage / 100) * 255))
  }
}

export const driver = new LedDriver()
