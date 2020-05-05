import Koa from 'koa'

import { log } from './logger'
import { LightSchedule } from './schedule'

const app = new Koa()

app.use((ctx) => {
  const schedule = new LightSchedule()

  switch (ctx.method.toUpperCase()) {
    case 'GET':
      ctx.status = 200
      ctx.body = schedule.current
      break
    default:
      ctx.status = 405
  }
})

export function startAPIServer(): void {
  app.listen(8080, '0.0.0.0')
  log('API Server started on 0.0.0.0:8080')
}
