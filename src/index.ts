import { driver } from './driver'
import { log } from './logger'
import { LightSchedule } from './schedule'

log(`Starting agent...`)

let forceQuit = false
const quit = (): void => {
  if (forceQuit) {
    process.exit()
  } else {
    forceQuit = true
  }
  log('Exiting... (Press ctrl+c again to force exit)')
  driver.setBrightness(100)
  process.off('SIGINT', quit)
}
process.on('SIGINT', quit)

const schedule = new LightSchedule()

driver.setBrightness(schedule.current)

schedule.subscribe((v) => {
  driver.setBrightness(v)
})
