import { computed, makeObservable, observable } from 'mobx'

export abstract class BaseState {
  abstract id: string

  parent?: BaseState

  private _isActive = false

  // States

  initial?: string

  @observable currentState?: BaseState

  prevState?: BaseState

  states = new Map<string, BaseState>()

  abstract registerState: (State: any) => this

  exit = (payload?: any) => {
    if (this.currentState) {
      this.currentState.exit(payload)
    }
    this.onEnter?.(payload)
  }

  enter = (payload?: any) => {
    if (this.initial) {
      const next = this.states.get(this.initial)
      if (!next) throw Error(`No state found with id ${this.initial}`)
      this.currentState = next
      this.currentState.enter(payload)
    }
  }

  onEnter?: (payload?: any) => void

  onExit?: (payload?: any) => void

  // Events

  events = new Map<string, (payload: any) => void>()

  registerEvent = (id: string, cb: (payload: any) => void) => {
    this.events.set(id, cb)
  }

  handleEvent = (id: `on${any}`, payload: any) => {
    const eventHandler = this[id as keyof this]
    if (eventHandler && 'call' in eventHandler)
      (eventHandler as unknown as (payload: any) => void)(payload)
    this.currentState?.handleEvent(id, payload)
  }

  // Transitions

  transition(id: string) {
    const next = this.states.get(id)
    if (!id) throw Error(`No state found with id ${id}`)
    const prev = this.currentState
    if (prev) {
      this.prevState = prev
      prev.exit?.()
    }
    next?.enter()
  }

  // Helpers

  isIn = (path: string) => {
    const ids = path.split('.').reverse()
    let state: BaseState = this
    while (ids.length > 0) {
      const id = ids.pop()
      if (!id) return true
      if (state.currentState?.id === id) {
        if (ids.length === 0) return true
        state = state.currentState
        continue
      } else return false
    }
    return false
  }

  isInAny = (...paths: string[]) => {
    return paths.some(this.isIn)
  }

  // Properties

  get isActive() {
    return this._isActive
  }

  get type() {
    if (!this.parent) return 'root'
    if (this.states.size === 0) return 'leaf'
    return 'branch'
  }

  @computed get currentPath(): string {
    if (!this.currentState) return this.id
    return this.id + '.' + this.currentState.currentPath
  }
}
