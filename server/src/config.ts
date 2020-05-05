import { resolve } from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: resolve(__dirname, '../../.env') })

export const PORT = process.env.SERVER_PORT
  ? parseInt(process.env.SERVER_PORT)
  : 8081
