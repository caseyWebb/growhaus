import * as ko from 'knockout'

import { WebApiEvents, WeatherData } from '@caseywebb/growhaus'

import { socket } from 'src/services/socket'

export default class HomeViewModel {
  protected weather = ko.observable<WeatherData>()
  protected weatherReady = ko.observable(false)

  constructor() {
    socket.on(WebApiEvents.WeatherData, (data) => {
      this.weather(data)
      this.weatherReady(true)
    })
  }
}
