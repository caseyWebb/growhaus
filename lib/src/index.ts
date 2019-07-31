export interface DarkSkyResponse {
  code: number // HTTP response code
  currently: {
    uvIndex: number
  }
  hourly: {
    data: {
      time: number
      uvIndex: number
    }[]
  }
}

export enum WebApiEvents {
  WeatherData = 'weather'
}

export interface WebApiMessage {
  event: WebApiEvents
  data: any
}

export interface WeatherDataMessage extends WebApiMessage {
  event: WebApiEvents.WeatherData
  data: WeatherData
}

export interface CurrentWeatherData {
  brightness: number
  uvIndex: number
}

export interface HourlyWeatherDatum {
  time: number
  uvIndex: number
}

export interface WeatherData {
  current: CurrentWeatherData
  hourly: HourlyWeatherDatum[]
}
