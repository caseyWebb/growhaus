export * from './subscribable'

export enum WebApiEvents {
  AgentData = 'agents',
  WeatherData = 'weather',
}

export interface WebApiMessage {
  event: WebApiEvents
  data: any
}

export interface AgentDataMessage extends WebApiMessage {
  event: WebApiEvents.AgentData
  data: {
    agents: { [k: string]: AgentData }
  }
}

export interface AgentData {
  brightness: number
}

export interface WeatherDataMessage extends WebApiMessage {
  event: WebApiEvents.WeatherData
  data: WeatherData
}

export interface CurrentWeatherData {
  uvIndex: number
}

export interface HourlyWeatherDatum {
  uvIndex: number
}

export interface WeatherData {
  current: CurrentWeatherData
  hourly: HourlyWeatherDatum[]
}
