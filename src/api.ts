import Koa from 'koa'
import bodyParser from 'koa-body'

import { driver } from './driver'
import { log } from './logger'
import { schedule } from './schedule'

const app = new Koa()

app.use(bodyParser())

app.use((ctx) => {
  switch (ctx.method.toUpperCase()) {
    case 'GET':
      ctx.status = 200
      ctx.body = JSON.stringify({
        brightness: driver.getBrightness(),
      })
      break
    case 'POST':
      {
        try {
          const value = parseInt(ctx.request.body.brightness)
          if (isNaN(value) || value < 0 || value > 255) {
            throw new Error()
          } else {
            let duration = parseInt(ctx.request.body.duration)
            if (isNaN(duration)) duration = 15
            ctx.status = 200
            driver.setBrightness(value)
            schedule.pause(duration)
          }
        } catch (e) {
          ctx.status = 400
          ctx.message = `Invalid request body. Expected object { "brightness": 0-255, "duration": 15 }, received ${JSON.stringify(
            ctx.request.body
          )}`
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
