import { Subscribable } from './subscribable'

class State extends Subscribable {
  public current = 0

  constructor() {
    super()
  }
}

export const state = new State()
