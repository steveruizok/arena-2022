import { types } from 'mobx-state-tree'

export const IBounds = types.model('Bounds', {
  minX: types.number,
  midX: types.number,
  maxX: types.number,
  minY: types.number,
  midY: types.number,
  maxY: types.number,
  width: types.number,
  height: types.number,
})
