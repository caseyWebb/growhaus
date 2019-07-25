import { DRIVER_PWM_PIN, SERVER_URL, AGENT_NAME } from './config'
import { LedDriver } from './driver'
import { LightSchedule } from './schedule'
import { Socket, IncomingEvent } from './socket'

main()

async function main() {
  const driver = new LedDriver(DRIVER_PWM_PIN)
  const socket = new Socket(`${SERVER_URL}/agent/${AGENT_NAME}`)
  const offlineFallbackSchedule = new LightSchedule()

  process.on('SIGINT', () => driver.setBrightness(100))

  socket.on(IncomingEvent.Brightness, (m) => {
    // pause until 10 minutes after we should have received a new message
    offlineFallbackSchedule.pause(m.duration + 10)

    driver.setBrightness(m.brightness)
  })

  socket.on(IncomingEvent.OfflineSchedule, (s) =>
    offlineFallbackSchedule.set(s.schedule)
  )

  offlineFallbackSchedule.subscribe(driver.setBrightness)
}
