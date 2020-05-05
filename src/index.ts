import { driver } from './driver'
import { LightSchedule } from './schedule'

console.log(`Starting agent...`)

let forceQuit = false
const quit = () => {
  if (forceQuit) {
    process.exit()
  } else {
    forceQuit = true
  }
  console.log('Exiting... (Press ctrl+c again to force exit)')
  driver.setBrightness(100)
  process.off('SIGINT', quit)
}
process.on('SIGINT', quit)

const schedule = new LightSchedule()

schedule.subscribe((v) => driver.setBrightness(v))
