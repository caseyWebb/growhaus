import Koa from 'koa'
import enableWebSockets from 'koa-websocket'

import { websocketRoutes } from './api'
import { PORT } from './config'
import { heartbeat } from './heartbeat'

const app = enableWebSockets(new Koa())

app.ws.use(async (ctx, next) => {
  console.log(ctx.url)
  heartbeat(ctx.websocket)
  await next()
})

websocketRoutes.forEach((r) => app.ws.use(r))

app.listen(PORT).on('listening', () => {
  console.log(`Server listening on port ${PORT}`)
})
