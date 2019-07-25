import autobind from 'autobind-decorator'
import fetch from 'node-fetch'

import { DARK_SKY_API_KEY, DARK_SKY_LOCATION } from './config'
import { Subscribable } from './subscribable'

type DarkSkyResponse = {
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

class Weather extends Subscribable {
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
