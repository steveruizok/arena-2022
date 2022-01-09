import { App } from '..'
import { BaseState } from './BaseState'

export class RootState extends BaseState {
  name = 'root'

  constructor() {
    super()
    // register states...
    this.enter()
  }

  send(event: `on${any}`, payload: any) {
    this.handleEvent(event, payload)
  }
}
