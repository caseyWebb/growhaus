import { resolve } from 'path'
import dotenv from 'dotenv'
import { LedOption } from 'pi-io'

export enum BoardType {
  RaspberryPi = 'pi'
}

dotenv.config({ path: resolve(__dirname, '../../.env') })

export const DRIVER_PWM_PIN: LedOption = process.env.DRIVER_PWM_PIN
  ? (process.env.DRIVER_PWM_PIN as LedOption)
  : 'GPIO18'

export const SERVER_URL = process.env.SERVER_URL || 'ws://localhost:3001'

export const AGENT_NAME = process.env.AGENT_NAME || 'growhaus-agent'

export const BOARD = (process.env.BOARD as BoardType) || BoardType.RaspberryPi
