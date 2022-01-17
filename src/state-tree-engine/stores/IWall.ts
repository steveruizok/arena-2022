import { types } from 'mobx-state-tree'

export const IWallType = types.enumeration('WallType', ['stone'])

export const IWall = types.model('Wall', {
  id: types.identifier,
  type: IWallType,
  isWalkable: types.boolean,
})
