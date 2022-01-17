import Vec from '@tldraw/vec'
import { Bounds3d, Verts } from '~types'
import { Vec3d } from './vec3d'

export const SIZE = 32
export const MAX_Z = 2
export const PADDING = 0
export const OFFSET = [0, 0]
export const SEXTANT = (Math.PI * 2) / 8
export const FACINGS = {
  east: 1,
  southEast: 2,
  south: 3,
  southWest: 4,
  west: 5,
  northWest: 6,
  north: 7,
  northEast: 8,
}

// The dimensions of a block in isometric space
export const DIMENSIONS = {
  x: SIZE,
  y: SIZE / 2,
  z: Math.hypot(SIZE, SIZE / 2),
  w: SIZE * 2,
  h: SIZE,
}

const D = DIMENSIONS
export const getPath = (p: number) =>
  `M${0},${p / 2}L${D.x - p},${D.y} 0,${D.x - p / 2} ${-D.x + p},${D.y}Z`
export const TILE_PATH = getPath(0)
export const INDICATOR_PATH = getPath(3)

// The size of a sprite (padded around the block)
export const SPRITE_SIZE = {
  width: D.w + PADDING * 2,
  height: PADDING * 2 + D.z * MAX_Z + D.h,
  origin: {
    x: PADDING + D.x,
    y: D.z * MAX_Z + D.y / 2,
  },
}

export function getIsoBounds(position: number[], offset: number[], size: number[]): Bounds3d {
  const [px, py, pz] = Vec3d.add(position, offset)
  const [x, y, z] = size
  return {
    minX: px,
    midX: px + x / 2,
    maxX: px + x,
    minY: py,
    midY: py + y / 2,
    maxY: py + y,
    minZ: pz,
    midZ: pz + z / 2,
    maxZ: pz + z,
    width: x,
    height: y,
    depth: z,
  }
}

export function getIsoVerts({ minX, midX, maxX, minY, midY, maxY, minZ, maxZ }: Bounds3d): Verts {
  return {
    centerDown: [midX, midY, minZ],
    backDown: [minX, minY, minZ],
    backUp: [minX, minY, maxZ],
    rightDown: [maxX, minY, minZ],
    frontDown: [maxX, maxY, minZ],
    leftDown: [minX, maxY, minZ],
    centerUp: [midX, midY, maxZ],
    rightUp: [maxX, minY, maxZ],
    frontUp: [maxX, maxY, maxZ],
    leftUp: [minX, maxY, maxZ],
  }
}

export function isoToScreen(point: number[]): number[] {
  const [x, y, z] = point
  return [(x - y) * (DIMENSIONS.w / 2), (x + y) * (DIMENSIONS.h / 2) - (z - 1) * DIMENSIONS.z]
}

export function getScreenVerts(isoVerts: Verts) {
  return Object.entries(isoVerts).reduce(
    (acc, [key, value]) => Object.assign(acc, { [key]: isoToScreen(value) }),
    {} as Verts
  )
}

export function getScreenOutline(verts: Verts) {
  return [
    verts.leftUp,
    verts.backUp,
    verts.rightUp,
    verts.rightDown,
    verts.frontDown,
    verts.leftDown,
  ]
}

export function getTopPath(padding = 0) {
  const h = Math.hypot(padding, padding)
  const backUp = Vec.add(DEFAULT_VERTS.backUp, [0, h])
  const rightUp = Vec.add(DEFAULT_VERTS.rightUp, [-h * 2, 0])
  const leftUp = Vec.add(DEFAULT_VERTS.leftUp, [h * 2, 0])
  const frontUp = Vec.add(DEFAULT_VERTS.frontUp, [0, -h])
  return `M${leftUp} L ${backUp} ${rightUp} ${frontUp}Z`
}

export function getBlockVerts(position: number[], offset: number[], size: number[], padding = 0) {
  const isoBounds = getIsoBounds(position, offset, size)
  const isoVerts = getIsoVerts(isoBounds)
  return getScreenVerts(isoVerts)
}

export function getBlockPaths(verts: Verts) {
  const { leftUp, backUp, rightUp, rightDown, frontUp, frontDown, backDown, leftDown } = verts
  return {
    top: `M${leftUp} L ${backUp} ${rightUp} ${frontUp}Z`,
    bottom: `M${backDown} L ${rightDown} ${frontDown} ${leftDown}Z`,
    north: `M${backUp} L ${rightUp} ${rightDown} ${backDown}Z`,
    east: `M${rightUp} L ${rightDown} ${frontDown} ${frontUp}Z`,
    south: `M${frontUp} L ${frontDown} ${leftDown} ${leftUp}Z`,
    west: `M${backUp} L ${backDown} ${leftDown} ${leftUp}Z`,
    outline: `M${leftUp} L${backUp} ${rightUp} ${rightDown} ${frontDown} ${leftDown}Z`,
  }
}

export const DEFAULT_VERTS = getBlockVerts([0, 0, 0], [0, 0, 0], [1, 1, 1])
export const DEFAULT_PATHS = getBlockPaths(DEFAULT_VERTS)
