import * as ko from 'knockout'

import { WeatherData, WebApiEvents } from '@caseywebb/growhaus'
import { socket } from 'src/services/socket'

class WeatherModel {
  public data = ko.observable<WeatherData>()

  public ready = ko.observable(false)

  public lastUpdated = ko.observable<number>()

  constructor() {
    socket.on(WebApiEvents.WeatherData, (data) => {
      this.data(data)
      this.ready(true)
      this.lastUpdated(Date.now())
    })
  }
}

export const weather = new WeatherModel()
