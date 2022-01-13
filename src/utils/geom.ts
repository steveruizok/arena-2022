import Vec from '@tldraw/vec'
import { Bounds } from '~types'

/**
 * Get whether a point is inside of a bounds.
 *
 * @param A The point to check.
 * @param b The bounds to check.
 * @returns
 */
export function pointInBounds(A: number[], b: Bounds): boolean {
  return !(A[0] < b.minX || A[0] > b.maxX || A[1] < b.minY || A[1] > b.maxY)
}

/**
 * Get whether a point is inside of a rectangle.
 *
 * @param A the point to check.
 * @param point
 * @param size
 */
export function pointInRect(A: number[], point: number[], size: number[]): boolean {
  return !(
    A[0] < point[0] ||
    A[0] > point[0] + size[0] ||
    A[1] < point[1] ||
    A[1] > point[1] + size[1]
  )
}

/**
 * Get whether a 3D point is inside of a cube.
 *
 * @param A the point to check.
 * @param point
 * @param size
 */
export function pointInCube(A: number[], point: number[], size: number[]): boolean {
  return !(
    A[0] < point[0] ||
    A[0] > point[0] + size[0] ||
    A[1] < point[1] ||
    A[1] > point[1] + size[1] ||
    A[2] < point[2] ||
    A[2] > point[2] + size[2]
  )
}

/**
 * Get whether a point is inside of a polygon.
 *
 * @param point
 * @param points
 */
export function pointInPolygon(p: number[], points: number[][]): boolean {
  let wn = 0
  points.forEach((a, i) => {
    const b = points[(i + 1) % points.length]
    if (a[1] <= p[1]) {
      if (b[1] > p[1] && Vec.cross(a, b, p) > 0) {
        wn += 1
      }
    } else if (b[1] <= p[1] && Vec.cross(a, b, p) < 0) {
      wn -= 1
    }
  })
  return wn !== 0
}
