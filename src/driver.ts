import { Board, Led } from 'johnny-five'
import { default as PiIO, LedOption } from 'pi-io'

import { log } from './logger'

export const DRIVER_PWM_PIN: LedOption = 'GPIO18'

class LedDriver {
  private readonly ready: Promise<void>

  private led!: Led

  private brightness = 255

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

  public getBrightness(): number {
    return this.brightness
  }

  public async setBrightness(intensity: number): Promise<void> {
    await this.ready
    intensity = Math.min(Math.max(intensity, 0), 255)
    log(`Setting brightness to ${intensity}`)
    this.led.on()
    this.led.brightness(255 - intensity)
    this.brightness = intensity
  }
}

export const driver = new LedDriver()
