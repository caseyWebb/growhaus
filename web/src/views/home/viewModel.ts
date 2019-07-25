import { socket } from 'src/services/socket'

export default class HomeViewModel {
  constructor() {
    socket.send('Home')
  }
}
