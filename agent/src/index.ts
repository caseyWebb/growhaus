import { AGENT_NAME, BOARD, DRIVER_PWM_PIN, SERVER_URL } from './config'
import { LedDriver } from './driver'
import { LightSchedule } from './schedule'
import { Socket, IncomingEvent } from './socket'
import { AgentState } from './state'

main()

async function main() {
  console.log(`Starting agent with id "${AGENT_NAME}"`)

  const state = new AgentState()
  const driver = new LedDriver({
    board: BOARD,
    pin: DRIVER_PWM_PIN
  })
  const socket = new Socket(`${SERVER_URL}/agent/${AGENT_NAME}`)
  const offlineFallbackSchedule = new LightSchedule()

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
    offlineFallbackSchedule.dispose()
    process.off('SIGINT', quit)
  }
  process.on('SIGINT', quit)

  state.subscribe(() => {
    driver.setBrightness(state.brightness)
    if (socket.connected) {
      socket.send(state)
    }
  })

  socket.on(IncomingEvent.Brightness, (m) => {
    // pause until 10 minutes after we should have received a new message
    offlineFallbackSchedule.pause(m.duration + 10)
    state.setBrightness(m.brightness)
  })

  offlineFallbackSchedule.subscribe(state.setBrightness)

  console.log('Agent started')
}
