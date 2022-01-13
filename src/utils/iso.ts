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

// The size of a sprite (padded around the block)
export const spriteSize = {
  width: DIMENSIONS.w + PADDING * 2,
  height: PADDING * 2 + DIMENSIONS.z * MAX_Z + DIMENSIONS.h,
  origin: {
    x: PADDING + DIMENSIONS.x,
    y: DIMENSIONS.z * MAX_Z + DIMENSIONS.y / 2,
  },
}

// export const spaceToSprite = (point: number[]): number[] => {
//   const screenPoint = spaceToScreen(point)
//   return [screenPoint[0] + spriteSize.origin.x, screenPoint[0] + spriteSize.origin.y]
// }

// export const isoToScreen = (point: number[]): number[] => {
//   const [x, y, z] = point
//   return [
//     (x - y) * (DIMENSIONS.w / 2) + OFFSET[0],
//     (x + y) * (DIMENSIONS.h / 2) - z * DIMENSIONS.z + OFFSET[1],
//   ]
// }

// export const screenToIso = (point: number[]): number[] => {
//   let [x, y, z = 0] = point
//   x /= DIMENSIONS.w / 2
//   x /= 2
//   y -= PADDING
//   y /= DIMENSIONS.h / 2
//   y /= 2
//   return [Math.floor(y + x), Math.floor(y - x), z]
// }
