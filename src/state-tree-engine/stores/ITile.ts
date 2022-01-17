import { types } from 'mobx-state-tree'

export const ITileType = types.enumeration('TileType', ['grass', 'dirt', 'stone', 'water'])

export const ITile = types.model('Tile', {
  id: types.identifier,
  type: ITileType,
  isWalkable: types.boolean,
})
