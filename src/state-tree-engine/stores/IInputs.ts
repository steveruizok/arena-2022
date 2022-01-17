import { Vec3d } from '~utils/vec3d'
import { EventHandlerTypes } from '../../types'
import { types } from 'mobx-state-tree'

function setArray(a: any, b: any) {
  for (let i = 0; i < b.length; i++) {
    a[i] = b[i]
  }
}

export const IInputs = types
  .model({
    shiftKey: types.boolean,
    ctrlKey: types.boolean,
    altKey: types.boolean,
    spaceKey: types.boolean,
    isPinching: types.boolean,
    currentPoint: types.array(types.number),
    currentScreenPoint: types.array(types.number),
    currentIsoPoint: types.array(types.number),
    currentIsoPosition: types.array(types.number),
    previousPoint: types.array(types.number),
    previousIsoPoint: types.array(types.number),
    previousIsoPosition: types.array(types.number),
    previousScreenPoint: types.array(types.number),
    originScreenPoint: types.array(types.number),
    originPoint: types.array(types.number),
    state: types.enumeration(['pointing', 'pinching', 'idle']),
    pointerIds: types.array(types.number),
  })
  .extend((self) => {
    const updatePoint = (screenPoint: number[], worldPoint: number[], isoPoint: number[]) => {
      setArray(self.previousScreenPoint, self.currentScreenPoint)
      setArray(self.currentScreenPoint, screenPoint)
      setArray(self.previousPoint, self.currentPoint)
      setArray(self.currentPoint, worldPoint)
      setArray(self.previousIsoPoint, self.currentIsoPoint)
      setArray(self.currentIsoPoint, isoPoint)
      setArray(self.previousIsoPosition, self.currentIsoPosition)
      setArray(self.currentIsoPosition, Vec3d.floor(self.currentIsoPoint))
    }

    const updateModifiers = (
      event:
        | EventHandlerTypes['gesture']
        | EventHandlerTypes['pointer']
        | EventHandlerTypes['keyboard']
        | EventHandlerTypes['wheel']
        | EventHandlerTypes['touch']
        | EventHandlerTypes['pinch']
    ) => {
      if ('shiftKey' in event) {
        self.shiftKey = event.shiftKey
        self.ctrlKey = event.metaKey || event.ctrlKey
        self.altKey = event.altKey
      }
    }

    const onWheel = (event: EventHandlerTypes['wheel']) => {
      updateModifiers(event)
    }

    const onPointerDown = (
      screenPoint: number[],
      worldPoint: number[],
      isoPoint: number[],
      event: EventHandlerTypes['pointer'] | EventHandlerTypes['wheel']
    ) => {
      if ('pointerId' in event) self.pointerIds.push(event.pointerId)
      updatePoint(screenPoint, worldPoint, isoPoint)
      updateModifiers(event)
      setArray(self.originScreenPoint, self.currentScreenPoint)
      setArray(self.originPoint, self.currentPoint)
      self.state = 'pointing'
    }

    const onPointerMove = (
      screenPoint: number[],
      worldPoint: number[],
      isoPoint: number[],
      event:
        | EventHandlerTypes['gesture']
        | EventHandlerTypes['pointer']
        | EventHandlerTypes['keyboard']
        | EventHandlerTypes['wheel']
        | EventHandlerTypes['touch']
    ) => {
      if (self.state === 'pinching') return
      updatePoint(screenPoint, worldPoint, isoPoint)
      updateModifiers(event)
    }

    const onPointerUp = (
      screenPoint: number[],
      worldPoint: number[],
      isoPoint: number[],
      event: EventHandlerTypes['pointer'] | EventHandlerTypes['wheel']
    ) => {
      updatePoint(screenPoint, worldPoint, isoPoint)
      self.pointerIds.clear()
      updateModifiers(event)
      self.state = 'idle'
    }

    const onKeyDown = (event: EventHandlerTypes['keyboard']) => {
      updateModifiers(event)
      switch (event.key) {
        case ' ': {
          self.spaceKey = true
          break
        }
      }
    }

    const onKeyUp = (event: EventHandlerTypes['keyboard']) => {
      updateModifiers(event)
      switch (event.key) {
        case ' ': {
          self.spaceKey = false
          break
        }
      }
    }

    const onPinchStart = (event: EventHandlerTypes['pinch']) => {
      updateModifiers(event)
      self.state = 'pinching'
    }

    const onPinch = (event: EventHandlerTypes['pinch']) => {
      if (self.state !== 'pinching') return
      updateModifiers(event)
    }

    const onPinchEnd = (event: EventHandlerTypes['pinch']) => {
      if (self.state !== 'pinching') return
      updateModifiers(event)
      self.state = 'idle'
    }

    return {
      actions: {
        updatePoint,
        updateModifiers,
        onKeyDown,
        onKeyUp,
        onPinch,
        onPinchEnd,
        onPinchStart,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onWheel,
      },
    }
  })
