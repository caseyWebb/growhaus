import * as route from 'koa-route'

import {
  AgentDataMessage,
  WebApiEvents,
  WeatherDataMessage
} from '@caseywebb/growhaus'

import { agents } from './agents'
import { weather } from './weather'

export const websocketRoutes = [
  route.all('/agent/:name', (ctx, name: string) => {
    agents.register(name, ctx.websocket)
    ctx.websocket.on('close', () => agents.unregister(name))
  }),

  route.all('/web', (ctx) => {
    const send = (message: AgentDataMessage | WeatherDataMessage) =>
      ctx.websocket.send(JSON.stringify(message))
    const sendAgentData = () =>
      send({
        event: WebApiEvents.AgentData,
        data: agents
      })
    const sendWeatherData = () =>
      send({
        event: WebApiEvents.WeatherData,
        data: weather
      })
    sendAgentData()
    sendWeatherData()
    agents.subscribe(sendAgentData)
    weather.subscribe(sendWeatherData)
  })
]
