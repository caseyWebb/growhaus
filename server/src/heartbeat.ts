import WebSocket from 'ws'

export function heartbeat(ws: WebSocket) {
  let alive = true
  let heartbeatTimeout = setInterval(() => {
    if (!alive) {
      ws.terminate()
      onClose()
      return
    }
    alive = false
    ws.ping()
  }, 30000)
  const onClose = () => {
    clearTimeout(heartbeatTimeout)
  }
  ws.on('close', onClose)
  ws.on('error', onClose)
  ws.on('pong', () => (alive = true))
}
