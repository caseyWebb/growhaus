import * as route from 'koa-route'

import { weather } from './weather'

export const websocketRoutes = [
  route.all('/agent/:name', (ctx, name: string) => {
    console.log('Agent connected:', name)

    ctx.websocket.on('close', () => {
      console.log('Agent disconnected:', name)
    })

    ctx.websocket.on('open', () => {
      console.log('Socket connection opened:', name)
      sendBrightness()
    })

    // const sendBrightness = () => ctx.websocket.send(weather.current.brightness)
    const sendBrightness = () =>
      ctx.websocket.send({
        event: 'brightness',
        brightness: 10,
        duration: 5
      })

    console.log('Setting brightness to', 10)
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
