import { resolve } from 'path'
import dotenv from 'dotenv'
import { BoardType } from './driver'

dotenv.config({ path: resolve(__dirname, '../../.env') })

export const DRIVER_PWM_PIN = process.env.DRIVER_PWM_PIN
  ? parseInt(process.env.DRIVER_PWM_PIN)
  : 18

export const SERVER_URL = process.env.SERVER_URL || 'ws://localhost:3001'

export const AGENT_NAME = process.env.AGENT_NAME || 'growhaus-agent'

export const BOARD = (process.env.BOARD as BoardType) || BoardType.RaspberryPi
