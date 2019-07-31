import autobind from 'autobind-decorator'
import fetch from 'node-fetch'

import { Subscribable, WeatherData } from '@caseywebb/growhaus'

import { DARK_SKY_API_KEY, DARK_SKY_LOCATION } from './config'

interface DarkSkyResponse {
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

class Weather extends Subscribable implements WeatherData {
  public readonly reloadIntervalDurationMinutes = 15

  public rateLimited: boolean = false

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
    if (!DARK_SKY_API_KEY) {
      throw new Error('DARK_SKY_API_KEY is not configured')
    }
    if (!DARK_SKY_LOCATION) {
      throw new Error('DARK_SKY_LOCATION is not configured')
    }
    this.reloadData()
    setInterval(
      this.reloadData,
      this.reloadIntervalDurationMinutes * 60 /* sec */ * 1000 /* ms */
    )
  }

  @autobind
  private async reloadData() {
    if (this.rateLimited) return this.next()
    const url = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/${DARK_SKY_LOCATION}?exclude=minutely,daily,alerts,flags`
    const data = (await fetch(url).then((r) => r.json())) as DarkSkyResponse
    if (data.code === 403) {
      console.log('Dark Sky API Limit Exceeded')
      this.preventAPISpamming()
      this.next()
      return
    }
    if (!data.currently || !data.hourly) {
      console.log(
        `Unexpected API response from ${url}:`,
        JSON.stringify(data, null, 2)
      )
      return
    }
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

  private preventAPISpamming() {
    this.rateLimited = true
    const midnight = new Date()
    midnight.setHours(24)
    midnight.setMinutes(0)
    midnight.setSeconds(0)
    midnight.setMilliseconds(0)
    const msUntilMidnight = midnight.getTime() - Date.now()
    setTimeout(() => {
      this.rateLimited = false
    }, msUntilMidnight)
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
