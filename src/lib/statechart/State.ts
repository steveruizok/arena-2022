import { makeObservable } from 'mobx'
import { App } from '~lib'
import { BaseState } from '.'

export class State extends BaseState {
  constructor(app: App, parent: BaseState) {
    super()
    this.app = app ?? ({} as App)
    this.parent = parent
    // @ts-ignore
    const { states = [], id, initial } = this.constructor
    states.forEach((state: typeof State & { id: string }) => this.registerState(state))
    this.initial = initial
    this.id = id
    makeObservable(this)
  }

  static id = 'state'

  id: string
  app: App

  registerState = (ChildState: typeof State & { id: string }) => {
    this.states.set(ChildState.id, new ChildState(this.app, this))
    return this
  }
}
