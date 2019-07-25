import autobind from 'autobind-decorator'
import { Gpio } from 'pigpio'

export class LedDriver {
  private readonly gpio = new Gpio(this.pwmPin, { mode: Gpio.OUTPUT })

  constructor(private readonly pwmPin: number) {}

  @autobind
  public setBrightness(percentage: number) {
    // bound between 10% and 100%
    percentage = Math.min(Math.max(percentage, 10), 100)
    console.log(`Setting brightness to ${percentage}%`)
    this.gpio.pwmWrite(255 - Math.round((percentage / 100) * 255))
  }
}
