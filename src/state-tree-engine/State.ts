import { Game } from './Game'

export class RootState {
  id = 'state'

  onEnter?: (info: any) => void

  onExit?: (info: any) => void

  states: Record<string, State> = {}

  currentState: State = this.states.selecting

  transition = (state: string, info = {}) => {
    const prev = this.currentState
    const next = this.states[state]
    prev.onExit?.(info)
    this.currentState = next
    next.onEnter?.(info)
  }

  handleEvent = (id: `on${any}`, payload: any) => {
    const eventHandler = this[id as keyof this]
    if (eventHandler && 'call' in eventHandler)
      (eventHandler as unknown as (payload: any) => void)(payload)
    this.currentState?.handleEvent(id, payload)
  }
}

export class State extends RootState {
  game: Game

  constructor(game: Game) {
    super()
    this.game = game
  }
}
