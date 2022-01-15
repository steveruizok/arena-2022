import { Verts } from '~types'

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

// export const spaceToSprite = (point: number[]): number[] => {
//   const screenPoint = spaceToScreen(point)
//   return [screenPoint[0] + spriteSize.origin.x, screenPoint[0] + spriteSize.origin.y]
// }

// export const isoToScreen = (point: number[]): number[] => {
//   const [x, y, z] = point
//   return [
//     (x - y) * (D.w / 2) + OFFSET[0],
//     (x + y) * (D.h / 2) - z * D.z + OFFSET[1],
//   ]
// }

// export const screenToIso = (point: number[]): number[] => {
//   let [x, y, z = 0] = point
//   x /= D.w / 2
//   x /= 2
//   y -= PADDING
//   y /= D.h / 2
//   y /= 2
//   return [Math.floor(y + x), Math.floor(y - x), z]
// }
