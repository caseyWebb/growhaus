import Koa from 'koa'

import { driver } from './driver'
import { log } from './logger'

const app = new Koa()

app.use((ctx) => {
  switch (ctx.method.toUpperCase()) {
    case 'GET':
      ctx.status = 200
      ctx.body = driver.getBrightness()
      break
    case 'POST':
      {
        const value = parseInt(ctx.response.body)
        if (isNaN(value) || value < 0 || value > 255) {
          ctx.status = 400
          ctx.message = 'Invalid request body, should be integer between 0-255'
        } else {
          ctx.status = 200
          driver.setBrightness(value)
        }
      }
      break
    default:
      ctx.status = 405
  }
})

export function startAPIServer(): void {
  app.listen(8080, '0.0.0.0')
  log('API Server started on 0.0.0.0:8080')
}
