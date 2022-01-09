import { action, makeObservable, observable } from 'mobx'
import { App } from '.'
import { EventHandlerTypes } from '../types'

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
  @observable currentScreenPoint = [0, 0]
  @observable currentPoint = [0, 0]
  @observable previousScreenPoint = [0, 0]
  @observable previousPoint = [0, 0]
  @observable originScreenPoint = [0, 0]
  @observable originPoint = [0, 0]
  @observable state: 'pointing' | 'pinching' | 'idle' = 'idle'

  pointerIds = new Set<number>()

  private updateModifiers(
    event:
      | EventHandlerTypes['gesture']
      | EventHandlerTypes['pointer']
      | EventHandlerTypes['keyboard']
      | EventHandlerTypes['wheel']
      | EventHandlerTypes['touch']
  ) {
    if ('clientX' in event) {
      this.previousScreenPoint = this.currentScreenPoint
      this.currentScreenPoint = [event.clientX, event.clientY]
    }
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
    this.updateModifiers(event)
    this.originScreenPoint = this.currentScreenPoint
    this.originPoint = point
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
    this.updateModifiers(event)
    this.previousPoint = this.currentPoint
    this.currentPoint = point
  }

  @action onPointerUp = (point: number[], event: EventHandlerTypes['pointer']) => {
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
    point: number[],
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
    point: number[],
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
    point: number[],
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
