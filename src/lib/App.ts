import { action, computed, makeObservable, observable } from 'mobx'
import { EventHandlers, GameState } from '../types'
import { Inputs } from './Inputs'
import { Viewport } from './Viewport'
import { Level } from './Level'
import { BaseState } from './statechart'
import { State } from './statechart/State'
import * as states from './states'
import { Block } from './Block'
import { PathFinder } from './PathFinder'

export class App extends BaseState {
  constructor() {
    super()
    // @ts-ignore
    const { states = [], initial } = this.constructor
    states.forEach((state: typeof State & { id: string }) => this.registerState(state))
    this.initial = initial
    makeObservable(this)
    this.enter()
  }

  static states = [states.Selecting, states.SelectedCharacters]

  static initial = 'selecting'

  id = 'app'

  viewport = new Viewport(this)
  pathfinder = new PathFinder(this)
  inputs = new Inputs(this)
  level = new Level(this, Level.DefaultMap)

  @observable state: GameState = {
    selectedIds: new Set<string>([]),
    paths: [],
  }

  isPinching = false

  registerState = (ChildState: typeof State & { id: string }) => {
    this.states.set(ChildState.id, new ChildState(this, this))
    return this
  }

  send(event: `on${any}`, payload: any) {
    this.handleEvent(event, payload)
  }

  @computed get hoveredBlock() {
    const { level } = this
    const { currentPoint } = this.inputs
    return level.getBlockBy((block) => block.canHover && block.hitTestPoint(currentPoint))
  }

  @computed get selectedBlocks() {
    return Array.from(this.state.selectedIds.values()).map((id) => this.level.getBlockById(id)!)
  }

  @action setSelectedBlocks = (blocks: Block[] | string[]) => {
    const { selectedIds } = this.state
    selectedIds.clear()
    if (typeof blocks[0] === 'string') {
      ;(blocks as string[]).forEach((id) => selectedIds.add(id))
    } else {
      ;(blocks as Block[]).forEach((block) => selectedIds.add(block.id))
    }
  }

  @action setPaths = (paths: number[][][]) => {
    this.state.paths = paths
  }

  /* --------------------- Events --------------------- */

  readonly onWheel: EventHandlers['wheel'] = (info) => {
    if (this.isPinching) return
    this.viewport.panCamera(info.delta)
    this.inputs.onWheel(info.event)
    this.onPointerMove(info)
  }

  readonly onPointerDown: EventHandlers['pointer'] = (info) => {
    if ('clientX' in info.event) {
      this.inputs.onPointerDown(info.point, info.event)
    }
  }

  readonly onPointerUp: EventHandlers['pointer'] = (info) => {
    if ('clientX' in info.event) {
      this.inputs.onPointerUp(info.point, info.event)
    }
  }

  readonly onPointerMove: EventHandlers['pointer'] = (info) => {
    if ('clientX' in info.event) {
      this.inputs.onPointerMove(info.point, info.event)
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
