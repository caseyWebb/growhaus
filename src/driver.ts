import { Board, Led } from 'johnny-five'
import { default as PiIO, LedOption } from 'pi-io'

import { log } from './logger'

export const DRIVER_PWM_PIN: LedOption = 'GPIO18'

class LedDriver {
  private readonly ready: Promise<void>

  private led!: Led

  constructor() {
    this.ready = new Promise((resolve) => {
      log('Initializing GPIO...')
      const io = new PiIO()
      const board = new Board({
        repl: false,
        io,
      })
      board.on('ready', () => {
        this.led = new Led((DRIVER_PWM_PIN as unknown) as number)
        log('GPIO initialized.')
        resolve()
      })
    })
  }

  public async setBrightness(percentage: number): Promise<void> {
    await this.ready
    percentage = Math.min(Math.max(percentage, 0), 100)
    log(`Setting brightness to ${percentage}%`)
    this.led.on()
    this.led.brightness(255 - Math.round((percentage / 100) * 255))
  }
}

export const driver = new LedDriver()
