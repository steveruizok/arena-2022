import { action, computed, makeObservable, observable } from 'mobx'
import { Vec3d } from '~utils/vec3d'
import { App } from '..'
import { EventHandlerTypes } from '../../types'

export class Inputs {
  app: App

  constructor(app: App) {
    this.app = app
    makeObservable(this)
  }

  // note: fine for dev, but we probably don't need to make
  // any of these properties observable
  @observable shiftKey = false
  @observable ctrlKey = false
  @observable altKey = false
  @observable spaceKey = false
  @observable isPinching = false
  @observable currentPoint = [0, 0]
  @observable currentScreenPoint = [0, 0]
  @observable currentIsoPoint = [0, 0, 0]
  @observable currentIsoPosition = [0, 0, 0]
  @observable previousPoint = [0, 0]
  @observable previousIsoPoint = [0, 0]
  @observable previousIsoPosition = [0, 0, 0]
  @observable previousScreenPoint = [0, 0]
  @observable originScreenPoint = [0, 0]
  @observable originPoint = [0, 0]
  @observable state: 'pointing' | 'pinching' | 'idle' = 'idle'

  pointerIds = new Set<number>()

  private updatePoint(point: number[]) {
    this.previousScreenPoint = this.currentScreenPoint
    this.currentScreenPoint = point
    this.previousPoint = this.currentPoint
    this.currentPoint = this.app.viewport.screenToWorld(this.currentScreenPoint)
    this.previousIsoPoint = this.currentIsoPoint
    this.currentIsoPoint = this.app.viewport.screenToIso(this.currentScreenPoint)
    this.previousIsoPosition = this.currentIsoPosition
    this.currentIsoPosition = Vec3d.floor(this.currentIsoPoint)
  }

  private updateModifiers(
    event:
      | EventHandlerTypes['gesture']
      | EventHandlerTypes['pointer']
      | EventHandlerTypes['keyboard']
      | EventHandlerTypes['wheel']
      | EventHandlerTypes['touch']
  ) {
    if ('shiftKey' in event) {
      this.shiftKey = event.shiftKey
      this.ctrlKey = event.metaKey || event.ctrlKey
      this.altKey = event.altKey
    }
  }

  @action onWheel = (event: EventHandlerTypes['wheel']) => {
    this.updateModifiers(event)
  }

  @action onPointerDown = (point: number[], event: EventHandlerTypes['pointer']) => {
    this.pointerIds.add(event.pointerId)
    this.updatePoint(point)
    this.updateModifiers(event)
    this.originScreenPoint = this.currentScreenPoint
    this.originPoint = this.currentPoint
    this.state = 'pointing'
  }

  @action onPointerMove = (
    point: number[],
    event:
      | EventHandlerTypes['gesture']
      | EventHandlerTypes['pointer']
      | EventHandlerTypes['keyboard']
      | EventHandlerTypes['wheel']
      | EventHandlerTypes['touch']
  ) => {
    if (this.state === 'pinching') return
    this.updatePoint(point)
    this.updateModifiers(event)
  }

  @action onPointerUp = (point: number[], event: EventHandlerTypes['pointer']) => {
    this.updatePoint(point)
    this.pointerIds.clear()
    this.updateModifiers(event)
    this.state = 'idle'
  }

  @action onKeyDown = (event: EventHandlerTypes['keyboard']) => {
    this.updateModifiers(event)
    switch (event.key) {
      case ' ': {
        this.spaceKey = true
        break
      }
    }
  }

  @action onKeyUp = (event: EventHandlerTypes['keyboard']) => {
    this.updateModifiers(event)
    switch (event.key) {
      case ' ': {
        this.spaceKey = false
        break
      }
    }
  }

  @action onPinchStart = (
    event:
      | EventHandlerTypes['gesture']
      | EventHandlerTypes['pointer']
      | EventHandlerTypes['keyboard']
      | EventHandlerTypes['wheel']
      | EventHandlerTypes['touch']
  ) => {
    this.updateModifiers(event)
    this.state = 'pinching'
  }

  @action onPinch = (
    event:
      | EventHandlerTypes['gesture']
      | EventHandlerTypes['pointer']
      | EventHandlerTypes['keyboard']
      | EventHandlerTypes['wheel']
      | EventHandlerTypes['touch']
  ) => {
    if (this.state !== 'pinching') return
    this.updateModifiers(event)
  }

  @action onPinchEnd = (
    event:
      | EventHandlerTypes['gesture']
      | EventHandlerTypes['pointer']
      | EventHandlerTypes['keyboard']
      | EventHandlerTypes['wheel']
      | EventHandlerTypes['touch']
  ) => {
    if (this.state !== 'pinching') return
    this.updateModifiers(event)
    this.state = 'idle'
  }
}
