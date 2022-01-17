import Vec from '@tldraw/vec'
import { types } from 'mobx-state-tree'
import { FIT_TO_SCREEN_PADDING } from '~constants'
import { Bounds } from '~types'
import { DIMENSIONS, PADDING } from '~utils/iso'
import { IBounds } from './stores'

export const IViewport = types
  .model('Viewport', {
    bounds: IBounds,
    camera: types.array(types.number),
    offset: types.array(types.number),
    minZoom: types.number,
    maxZoom: types.number,
    zooms: types.array(types.number),
  })
  .extend((self) => {
    // Views

    const screenToWorld = ([x, y]: number[]): number[] => {
      const {
        bounds: { minX, minY },
        offset: [ox, oy],
        camera: [cx, cy, cz],
      } = self
      return [(x - minX) / cz - cx - ox, (y - minY) / cz - cy - oy]
    }

    const worldToIso = (point: number[]): number[] => {
      let [x, y, z = 0] = point
      x /= DIMENSIONS.w / 2
      x /= 2
      y -= PADDING
      y /= DIMENSIONS.h / 2
      y /= 2
      return [y + x - 1, y - x - 1, z]
    }

    const screenToIso = (point: number[]): number[] => {
      return worldToIso(screenToWorld(point))
    }

    const worldToScreen = ([x, y]: number[]): number[] => {
      const {
        offset: [ox, oy],
        camera: [cx, cy, cz],
      } = self
      return [x * cz + cx + ox, y * cz + cy + oy]
    }

    const isoToScreen = (point: number[]): number[] => {
      const [x, y, z] = point
      return [(x - y) * (DIMENSIONS.w / 2), (x + y) * (DIMENSIONS.h / 2) - z * DIMENSIONS.z]
    }

    const isoToWorld = (point: number[]): number[] => {
      return isoToScreen(point)
    }

    // Actions

    const updateBounds = (bounds: Bounds) => {
      Object.assign(self.bounds, bounds)
      self.offset[0] = bounds.width / 2
      self.offset[1] = bounds.height / 4
    }

    const updateCamera = (camera: number[]) => {
      self.camera[0] = camera[0]
      self.camera[1] = camera[1]
      self.camera[2] = camera[2]
      return self
    }

    const panCamera = (delta: number[]) => {
      const {
        camera: [cx, cy, cz],
      } = self
      return updateCamera(Vec.sub([cx, cy], Vec.div(delta, cz)).concat(cz))
    }

    const pinchCamera = (point: number[], delta: number[], zoom: number) => {
      const {
        camera: [cx, cy, cz],
      } = self
      const nextPoint = Vec.sub([cx, cy], Vec.div(delta, cz))
      const nextZoom = cz + (zoom - cz) * 0.5
      const p0 = Vec.sub(Vec.div(point, cz), nextPoint)
      const p1 = Vec.sub(Vec.div(point, nextZoom), nextPoint)
      return updateCamera(Vec.toFixed(Vec.add(nextPoint, Vec.sub(p1, p0))).concat(nextZoom))
    }

    const zoomIn = () => {
      const {
        bounds,
        camera: [cx, cy, cz],
        zooms,
      } = self
      let zoom: number | undefined
      for (let i = 1; i < zooms.length; i++) {
        const z1 = zooms[i - 1]
        const z2 = zooms[i]
        if (z2 - cz <= (z2 - z1) / 2) continue
        zoom = z2
        break
      }
      if (zoom === undefined) zoom = zooms[zooms.length - 1]
      const center = [bounds.width / 2, bounds.height / 2]
      const p0 = Vec.sub(Vec.div(center, cz), center)
      const p1 = Vec.sub(Vec.div(center, zoom), center)
      return updateCamera(Vec.toFixed(Vec.add([cx, cy], Vec.sub(p1, p0))).concat(zoom))
    }

    const zoomOut = () => {
      const {
        bounds,
        camera: [cx, cy, cz],
        zooms,
      } = self
      let zoom: number | undefined
      for (let i = zooms.length - 1; i > 0; i--) {
        const z1 = zooms[i - 1]
        const z2 = zooms[i]
        if (z2 - cz >= (z2 - z1) / 2) continue
        zoom = z1
        break
      }
      if (zoom === undefined) zoom = zooms[0]
      const center = [bounds.width / 2, bounds.height / 2]
      const p0 = Vec.sub(Vec.div(center, cz), center)
      const p1 = Vec.sub(Vec.div(center, zoom), center)
      return updateCamera(Vec.toFixed(Vec.add([cx, cy], Vec.sub(p1, p0))).concat(zoom))
    }

    const resetZoom = () => {
      const {
        bounds,
        camera: [cx, cy, cz],
      } = self
      const center = [bounds.width / 2, bounds.height / 2]
      const p0 = Vec.sub(Vec.div(center, cz), [cx, cy])
      const p1 = Vec.sub(Vec.div(center, 1), [cx, cy])
      return updateCamera(Vec.toFixed(Vec.add([cx, cy], Vec.sub(p1, p0))).concat(1))
    }

    const zoomToBounds = ({ minX, minY, width, height }: Bounds) => {
      const {
        bounds,
        camera: [_cx, _cy, cz],
        maxZoom,
        minZoom,
      } = self
      let zoom = Math.min(
        (bounds.width - FIT_TO_SCREEN_PADDING) / width,
        (bounds.height - FIT_TO_SCREEN_PADDING) / height
      )
      zoom = Math.min(maxZoom, Math.max(minZoom, cz === zoom || cz < 1 ? Math.min(1, zoom) : zoom))
      return updateCamera(
        Vec.add(
          [-minX, -minY],
          [(bounds.width - width * zoom) / 2 / zoom, (bounds.height - height * zoom) / 2 / zoom]
        ).concat(zoom)
      )
    }

    return {
      views: {
        screenToWorld,
        worldToIso,
        screenToIso,
        worldToScreen,
        isoToScreen,
        isoToWorld,
        get currentView(): Bounds {
          const {
            bounds,
            camera: [cx, cy, cz],
          } = self
          const w = bounds.width / cz
          const h = bounds.height / cz
          return {
            minX: -cx,
            minY: -cy,
            midX: w / 2 - cx,
            midY: w / 2 - cy,
            maxX: w - cx,
            maxY: h - cy,
            width: w,
            height: h,
          }
        },
      },
      actions: {
        updateCamera,
        updateBounds,
        panCamera,
        pinchCamera,
        zoomIn,
        zoomOut,
        zoomToBounds,
        resetZoom,
      },
    }
  })
