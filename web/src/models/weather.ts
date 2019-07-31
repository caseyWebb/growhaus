import { WeatherData, WebApiEvents } from '@caseywebb/growhaus'

import { AbstractSocketModel } from './_abstract'

class WeatherModel extends AbstractSocketModel<WeatherData> {
  constructor() {
    super(WebApiEvents.WeatherData)
  }
}

export const weather = new WeatherModel()
