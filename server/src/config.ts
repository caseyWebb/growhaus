import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000

export const DARK_SKY_API_KEY = process.env.DARK_SKY_API_KEY as string
