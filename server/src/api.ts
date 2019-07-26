import * as route from 'koa-route'

import { weather } from './weather'

export const websocketRoutes = [
  route.all('/agent/:name', (ctx, name: string) => {
    // const sendBrightness = () => ctx.websocket.send(weather.current.brightness)
    const sendBrightness = () => ctx.websocket.send(10)
    sendBrightness()
    // weather.subscribe(sendBrightness)
  }),

  route.all('/web', (ctx) => {
    const sendWeatherData = () => {
      ctx.websocket.send(
        JSON.stringify({
          event: 'weather',
          data: weather
        })
      )
    }
    sendWeatherData()
    weather.subscribe(sendWeatherData)
  })
]
