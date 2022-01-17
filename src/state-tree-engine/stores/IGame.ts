import { Handler } from '@use-gesture/react'
import { Instance, types } from 'mobx-state-tree'
import { EventHandlers } from '~types'
import { IEntity } from './IEntity'
import { IInputs } from './IInputs'
import { ILevel } from './ILevel'
import { IPosition } from './IPosition'
import { ITile } from './ITile'
import { IViewport } from './IViewport'

const States: Record<string, any> = {}

export const IGame = types
  .model('Game', {
    level: ILevel,
    viewport: IViewport,
    selectedEntity: types.safeReference(IEntity),
    hoveredPosition: types.safeReference(IPosition),
    currentStateId: types.string,
    inputs: IInputs,
  })
  .extend((self) => {
    // Actions

    let prevPointerMoveInfo:
      | {
          point: number[]
          event: PointerEvent | React.PointerEvent<Element> | WheelEvent
        }
      | undefined = undefined

    const setSelectedEntityId = (entityId: Instance<typeof IEntity> | undefined) => {
      self.selectedEntity = entityId
    }

    const setHoveredPositionId = (id: Instance<typeof IPosition> | undefined) => {
      self.hoveredPosition = id
    }

    const onWheel: EventHandlers['wheel'] = (info) => {
      if (self.inputs.isPinching) return
      self.viewport.panCamera(info.delta)
      self.inputs.onWheel(info.event)
      onPointerMove(info)
    }

    const onPointerDown: EventHandlers['pointer'] = (info) => {
      if ('clientX' in info.event) {
        self.inputs.onPointerDown(
          info.point,
          self.viewport.screenToWorld(info.point),
          self.viewport.screenToIso(info.point),
          info.event
        )
      }
    }

    const onPointerUp: EventHandlers['pointer'] = (info) => {
      if ('clientX' in info.event) {
        self.inputs.onPointerUp(
          info.point,
          self.viewport.screenToWorld(info.point),
          self.viewport.screenToIso(info.point),
          info.event
        )
      }
    }

    const onPointerMove: EventHandlers['pointer'] = (info) => {
      prevPointerMoveInfo = info
      const worldPoint = self.viewport.screenToWorld(info.point)
      const isoPoint = self.viewport.worldToIso(worldPoint)
      self.hoveredPosition = self.level.getPosition(isoPoint)
      if ('clientX' in info.event) {
        self.inputs.onPointerMove(info.point, worldPoint, isoPoint, info.event)
      }
    }

    const onKeyDown: EventHandlers['keyboard'] = (info) => {
      self.inputs.onKeyDown(info.event)
    }

    const onKeyUp: EventHandlers['keyboard'] = (info) => {
      self.inputs.onKeyUp(info.event)
    }

    const onPinchStart: EventHandlers['pinch'] = (info) => {
      self.inputs.isPinching = true
      self.inputs.onPinchStart(info.event)
    }

    const onPinch: EventHandlers['pinch'] = (info) => {
      self.inputs.isPinching = true
      self.inputs.onPinch(info.event)
      self.viewport.pinchCamera(info.point, [0, 0], info.offset[0])
    }

    const onPinchEnd: EventHandlers['pinch'] = (info) => {
      self.inputs.isPinching = false
      self.inputs.onPinchEnd(info.event)
    }

    return {
      actions: {
        setSelectedEntityId,
        setHoveredPositionId,
        onWheel,
        onPointerDown,
        onPointerUp,
        onPointerMove,
        onKeyDown,
        onKeyUp,
        onPinchStart,
        onPinch,
        onPinchEnd,
      },
      views: {
        get currentState() {
          return States[self.currentStateId]
        },
      },
    }
  })
