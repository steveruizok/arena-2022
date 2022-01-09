import { action, computed, makeObservable, observable } from 'mobx'
import { App } from '../App'
import { Bounds, Camera } from '../../types'
import Vec from '@tldraw/vec'
import { FIT_TO_SCREEN_PADDING } from '../../constants'
import { screenToIso } from '../../utils/iso'

export class Viewport {
  app: App

  readonly minZoom = 0.1
  readonly maxZoom = 8
  readonly zooms = [0.1, 0.25, 0.5, 1, 2, 4, 8]

  constructor(app: App) {
    this.app = app
    makeObservable(this)
  }

  @observable bounds: Bounds = {
    minX: 0,
    midX: 0.5,
    maxX: 1,
    minY: 0,
    midY: 0.5,
    maxY: 1,
    width: 1,
    height: 1,
  }

  @observable camera: Camera = {
    point: [0, 0],
    zoom: 1,
  }

  @action updateBounds(bounds: Bounds) {
    this.bounds = bounds
    return this
  }

  @action updateCamera(update: Partial<Camera>) {
    this.camera = { ...this.camera, ...update }
    return this
  }

  @computed get currentView(): Bounds {
    const {
      bounds,
      camera: { point, zoom },
    } = this
    const w = bounds.width / zoom
    const h = bounds.height / zoom
    return {
      minX: -point[0],
      minY: -point[1],
      midX: w / 2 - point[0],
      midY: w / 2 - point[1],
      maxX: w - point[0],
      maxY: h - point[1],
      width: w,
      height: h,
    }
  }

  @computed get currentView3d(): Bounds {
    const {
      bounds,
      camera: { point, zoom },
    } = this
    const w = bounds.width / zoom
    const h = bounds.height / zoom
    return {
      minX: -point[0],
      minY: -point[1],
      midX: w / 2 - point[0],
      midY: w / 2 - point[1],
      maxX: w - point[0],
      maxY: h - point[1],
      width: w,
      height: h,
    }
  }

  panCamera(delta: number[]) {
    this.updateCamera({
      point: Vec.sub(this.camera.point, Vec.div(delta, this.camera.zoom)),
    })
    return this
  }

  screenToWorld(point: number[]): number[] {
    const { minX, minY } = this.bounds
    const { point: cameraPoint, zoom } = this.camera
    const x = (point[0] - cameraPoint[0]) / zoom + minX
    const y = (point[1] - cameraPoint[1]) / zoom + minY
    return [x, y]
  }

  worldToScreen(point: number[]): number[] {
    const { minX, minY } = this.bounds
    const { point: cameraPoint, zoom } = this.camera
    const x = (point[0] - minX) * zoom + cameraPoint[0]
    const y = (point[1] - minY) * zoom + cameraPoint[1]
    return [x, y]
  }

  screenToIso(point: number[]): number[] {
    return screenToIso(point)
  }

  pinchCamera(point: number[], delta: number[], zoom: number) {
    const { camera } = this.app.viewport
    const nextPoint = Vec.sub(camera.point, Vec.div(delta, camera.zoom))
    const nextZoom = camera.zoom + (zoom - camera.zoom) * 0.5
    const p0 = Vec.sub(Vec.div(point, camera.zoom), nextPoint)
    const p1 = Vec.sub(Vec.div(point, nextZoom), nextPoint)
    this.updateCamera({ point: Vec.toFixed(Vec.add(nextPoint, Vec.sub(p1, p0))), zoom: nextZoom })
  }

  zoomIn = (): this => {
    const { camera, bounds, zooms } = this
    let zoom: number | undefined
    for (let i = 1; i < zooms.length; i++) {
      const z1 = zooms[i - 1]
      const z2 = zooms[i]
      if (z2 - camera.zoom <= (z2 - z1) / 2) continue
      zoom = z2
      break
    }
    if (zoom === undefined) zoom = zooms[zooms.length - 1]
    const center = [bounds.width / 2, bounds.height / 2]
    const p0 = Vec.sub(Vec.div(center, camera.zoom), center)
    const p1 = Vec.sub(Vec.div(center, zoom), center)
    return this.updateCamera({ point: Vec.toFixed(Vec.add(camera.point, Vec.sub(p1, p0))), zoom })
  }

  zoomOut = (): this => {
    const { camera, bounds, zooms } = this
    let zoom: number | undefined
    for (let i = zooms.length - 1; i > 0; i--) {
      const z1 = zooms[i - 1]
      const z2 = zooms[i]
      if (z2 - camera.zoom >= (z2 - z1) / 2) continue
      zoom = z1
      break
    }
    if (zoom === undefined) zoom = zooms[0]
    const center = [bounds.width / 2, bounds.height / 2]
    const p0 = Vec.sub(Vec.div(center, camera.zoom), center)
    const p1 = Vec.sub(Vec.div(center, zoom), center)
    return this.updateCamera({ point: Vec.toFixed(Vec.add(camera.point, Vec.sub(p1, p0))), zoom })
  }

  resetZoom = (): this => {
    const {
      bounds,
      camera: { zoom, point },
    } = this
    const center = [bounds.width / 2, bounds.height / 2]
    const p0 = Vec.sub(Vec.div(center, zoom), point)
    const p1 = Vec.sub(Vec.div(center, 1), point)
    return this.updateCamera({ point: Vec.toFixed(Vec.add(point, Vec.sub(p1, p0))), zoom: 1 })
  }

  zoomToBounds = ({ width, height, minX, minY }: Bounds): this => {
    const { bounds, camera } = this
    let zoom = Math.min(
      (bounds.width - FIT_TO_SCREEN_PADDING) / width,
      (bounds.height - FIT_TO_SCREEN_PADDING) / height
    )
    zoom = Math.min(
      this.maxZoom,
      Math.max(this.minZoom, camera.zoom === zoom || camera.zoom < 1 ? Math.min(1, zoom) : zoom)
    )
    const delta = [
      (bounds.width - width * zoom) / 2 / zoom,
      (bounds.height - height * zoom) / 2 / zoom,
    ]
    return this.updateCamera({ point: Vec.add([-minX, -minY], delta), zoom })
  }
}
