import Vec from '@tldraw/vec'
import { computed, makeObservable, observable } from 'mobx'
import { EventHandlers, EventHandlerTypes, GameState } from '../types'
import { Block } from './Block'
import { Inputs } from './Inputs'
import { RootState } from './statechart/RootState'
import { Viewport } from './Viewport'
import { Level } from './Level'

export class App extends RootState {
  constructor() {
    super()
    this.app = this
    makeObservable(this)
  }

  viewport = new Viewport(this)
  inputs = new Inputs(this)

  @observable state: GameState = {
    level: new Level(Level.DefaultMap),
  }

  @computed get map(): Block[] {
    const items = Object.values(this.state.level.blocks)
    return items
      .sort((a, b) => a.props.point[2] - b.props.point[2])
      .sort((a, b) => a.props.point[1] - b.props.point[1])
      .sort((a, b) => a.props.point[0] - b.props.point[0])
  }

  isPinching = false

  readonly onWheel: EventHandlers['wheel'] = (info) => {
    if (this.isPinching) return
    this.viewport.panCamera(info.delta)
    this.inputs.onWheel(info.event)
  }

  readonly onPointerDown: EventHandlers['pointer'] = (info) => {
    if ('clientX' in info.event) {
      this.inputs.onPointerDown(info.event)
    }
  }

  readonly onPointerUp: EventHandlers['pointer'] = (info) => {
    if ('clientX' in info.event) {
      this.inputs.onPointerUp(info.event)
    }
  }

  readonly onPointerMove: EventHandlers['pointer'] = (info) => {
    if ('clientX' in info.event) {
      this.inputs.onPointerMove(info.event)
    }
  }

  readonly onKeyDown: EventHandlers['keyboard'] = (info) => {
    this.inputs.onKeyDown(info.event)
  }

  readonly onKeyUp: EventHandlers['keyboard'] = (info) => {
    this.inputs.onKeyUp(info.event)
  }

  readonly onPinchStart: EventHandlers['pinch'] = (info) => {
    this.isPinching = true
    this.inputs.onPinchStart(info.event)
  }

  readonly onPinch: EventHandlers['pinch'] = (info) => {
    this.isPinching = true
    this.inputs.onPinch(info.event)
    this.viewport.pinchCamera(info.point, [0, 0], info.offset[0])
  }

  readonly onPinchEnd: EventHandlers['pinch'] = (info) => {
    this.isPinching = false
    this.inputs.onPinchEnd(info.event)
  }
}
