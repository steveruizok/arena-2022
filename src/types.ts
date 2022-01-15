import { Handler, WebKitGestureEvent } from '@use-gesture/react'
import { Level } from '~lib/Level'
import { Block } from './lib/Block'

export interface GameState {
  selectedIds: Set<string>
  paths: number[][][]
}

export interface Bounds {
  minX: number
  minY: number
  midX: number
  midY: number
  maxX: number
  maxY: number
  width: number
  height: number
}

export interface Bounds3d {
  minX: number
  minY: number
  minZ: number
  midX: number
  midY: number
  midZ: number
  maxX: number
  maxY: number
  maxZ: number
  width: number
  height: number
  depth: number
}

export interface Camera {
  point: number[]
  zoom: number
}

export type Verts = {
  centerDown: number[]
  backDown: number[]
  rightDown: number[]
  frontDown: number[]
  leftDown: number[]
  centerUp: number[]
  backUp: number[]
  rightUp: number[]
  frontUp: number[]
  leftUp: number[]
}

export type EventHandlerTypes = {
  pointer: PointerEvent | React.PointerEvent
  touch: TouchEvent | React.TouchEvent
  keyboard: KeyboardEvent | React.KeyboardEvent
  gesture: WebKitGestureEvent
  wheel: Handler<'wheel', WheelEvent>
  pinch: Handler<'pinch', PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent> | undefined
}

export interface BlockEventHandlerInfo {
  block: Block
}

export type EventHandlerInfo = BlockEventHandlerInfo // | others...

export type EventHandlers = {
  wheel: (
    info: EventHandlerInfo & { delta: number[]; point: number[]; event: EventHandlerTypes['wheel'] }
  ) => void
  pinch: (
    info: EventHandlerInfo & {
      delta: number[]
      point: number[]
      offset: number[]
      event:
        | EventHandlerTypes['wheel']
        | EventHandlerTypes['pointer']
        | EventHandlerTypes['touch']
        | EventHandlerTypes['keyboard']
        | EventHandlerTypes['gesture']
    }
  ) => void
  pointer: (
    info: EventHandlerInfo & {
      point: number[]
      event: EventHandlerTypes['pointer'] | EventHandlerTypes['wheel']
    }
  ) => void
  keyboard: (info: EventHandlerInfo & { event: EventHandlerTypes['keyboard'] }) => void
}
