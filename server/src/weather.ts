import autobind from 'autobind-decorator'
import fetch from 'node-fetch'

import { DarkSkyResponse, WeatherData } from '@caseywebb/growhaus'

import { DARK_SKY_API_KEY, DARK_SKY_LOCATION } from './config'
import { Subscribable } from './subscribable'

class Weather extends Subscribable implements WeatherData {
  public current = {
    brightness: 100,
    uvIndex: 10
  }
  public hourly: {
    time: number
    uvIndex: number
  }[] = []

  constructor() {
    super()
    this.reloadData()
    setInterval(this.reloadData, 15000)
  }

  @autobind
  private async reloadData() {
    if (!DARK_SKY_API_KEY) {
      throw new Error('DARK_SKY_API_KEY is not configured')
    }
    const data = (await fetch(
      `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${DARK_SKY_LOCATION}?exclude=minutely,daily,alerts,flags`
    ).then((r) => r.json())) as DarkSkyResponse
    this.current = {
      uvIndex: data.currently.uvIndex,
      brightness: Weather.calculateBrightness(data)
    }
    this.hourly = data.hourly.data.map((d) => ({
      time: d.time,
      uvIndex: d.uvIndex
    }))
    this.next()
  }

  private static calculateBrightness(data: DarkSkyResponse) {
    const next48HourUV = data.hourly.data.map((d) => d.uvIndex)
    const maxUV = Math.max(...next48HourUV)
    const minUV = Math.min(...next48HourUV)
    const currentUV = data.currently.uvIndex
    const uvSpread = maxUV - minUV
    return Math.round(100 * ((currentUV - minUV) / uvSpread))
  }
}

export const weather = new Weather()
