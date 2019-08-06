import { AGENT_NAME } from './config'

import { driver } from './driver'
import { offlineFallbackLightSchedule } from './schedule'
import { Connected, IncomingEvent, socket } from './socket'
import { state } from './state'

console.log(`Starting agent with id "${AGENT_NAME}"`)

let forceQuit = false
const quit = () => {
  if (forceQuit) {
    process.exit()
  } else {
    forceQuit = true
  }
  console.log('Exiting... (Press ctrl+c again to force exit)')
  driver.setBrightness(100)
  socket.dispose()
  offlineFallbackLightSchedule.dispose()
  process.off('SIGINT', quit)
}
process.on('SIGINT', quit)

state.subscribe(() => {
  driver.setBrightness(state.brightness)
  socket.sendState()
})

socket.on(Connected, () => socket.sendState)

socket.on(IncomingEvent.Brightness, (m) => {
  // pause until 10 minutes after we should have received a new message
  offlineFallbackLightSchedule.pause((m.duration + 10) * 60 * 1000)
  state.setBrightness(m.brightness)
})

offlineFallbackLightSchedule.subscribe(() =>
  state.setBrightness(offlineFallbackLightSchedule.brightness)
)
