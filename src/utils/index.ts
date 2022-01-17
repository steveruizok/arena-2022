import { nanoid } from 'nanoid'

export function uniqueId() {
  return nanoid()
}

export function rangeMap(length: number, cb: (index: number) => any) {
  return Array.from({ length }, (_, index) => cb(index))
}

export function rangeMap2d<T>(
  rows: number,
  cols: number,
  cb: (x: number, y: number, i: number) => T
): T[][] {
  return rangeMap(rows, (y) => rangeMap(cols, (x) => cb(x, y, rows * y + x)))
}
