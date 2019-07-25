import dotenv from 'dotenv'

dotenv.config()

export const DRIVER_PWM_PIN = process.env.DRIVER_PWM_PIN
  ? parseInt(process.env.DRIVER_PWM_PIN)
  : 18

export const SERVER_HOST = process.env.SERVER_HOST || 'localhost:3000'

export const AGENT_NAME = process.env.AGENT_NAME || 'growhaus-agent'
