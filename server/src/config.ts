import { resolve } from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: resolve(__dirname, '../../.env') })

export const PORT = process.env.SERVER_PORT
  ? parseInt(process.env.SERVER_PORT)
  : 8081

export const DARK_SKY_API_KEY = process.env.DARK_SKY_API_KEY as string
export const DARK_SKY_LOCATION = process.env.DARK_SKY_LOCATION as string
