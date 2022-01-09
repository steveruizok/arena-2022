import Vec from '@tldraw/vec'
import { makeObservable, observable } from 'mobx'
import { EventHandlers, EventHandlerTypes, GameState } from '../types'
import { Block } from './Block'
import { Inputs } from './Inputs'
import { RootState } from './statechart/RootState'
import { Viewport } from './Viewport'

export class App extends RootState {
  constructor() {
    super()
    this.app = this
    makeObservable(this)
  }

  viewport = new Viewport(this)
  inputs = new Inputs(this)

  @observable state: GameState = {
    blocks: Object.fromEntries(
      Array.from(Array(10).keys()).flatMap((x) =>
        Array.from(Array(10).keys()).map((y) => {
          const block = new Block({
            point: [x, y, 0],
            size: [1, 1, 1],
          })
          return [block.props.id, block]
        })
      )
    ),
    tiles: Object.fromEntries(
      Array.from(Array(10).keys()).flatMap((x) =>
        Array.from(Array(10).keys()).map((y) => {
          const block = new Block({
            point: [x, y, 0],
            size: [1, 1, 1],
          })
          return [block.props.id, block]
        })
      )
    ),
  }

  isPinching = false

  readonly onWheel: EventHandlers['wheel'] = (info) => {
    if (this.isPinching) return
    this.viewport.panCamera(info.delta)
    this.inputs.onWheel(info.event)
  }

  readonly onPointerDown: EventHandlers['pointer'] = (info) => {
    if ('clientX' in info.event) {
      const { clientX, clientY } = info.event
      this.inputs.onPointerDown(
        [...this.viewport.screenToWorld([clientX, clientY]), 0.5],
        info.event
      )
    }
  }

  readonly onPointerUp: EventHandlers['pointer'] = (info) => {
    if ('clientX' in info.event) {
      const { clientX, clientY } = info.event
      this.inputs.onPointerUp([...this.viewport.screenToWorld([clientX, clientY]), 0.5], info.event)
    }
  }

  readonly onPointerMove: EventHandlers['pointer'] = (info) => {
    if ('clientX' in info.event) {
      const { clientX, clientY } = info.event
      this.inputs.onPointerMove(
        [...this.viewport.screenToWorld([clientX, clientY]), 0.5],
        info.event
      )
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
    this.inputs.onPinchStart([...this.viewport.screenToWorld(info.point), 0.5], info.event)
  }

  readonly onPinch: EventHandlers['pinch'] = (info) => {
    this.isPinching = true
    this.inputs.onPinch([...this.viewport.screenToWorld(info.point), 0.5], info.event)
    this.viewport.pinchCamera(info.point, [0, 0], info.offset[0])
  }

  readonly onPinchEnd: EventHandlers['pinch'] = (info) => {
    this.isPinching = false
    this.inputs.onPinchEnd([...this.viewport.screenToWorld(info.point), 0.5], info.event)
  }
}
