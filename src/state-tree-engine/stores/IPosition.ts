import { types } from 'mobx-state-tree'
import { IEntity } from './IEntity'
import { IItem } from './IItem'
import { ITile } from './ITile'

export const IPosition = types.model('Position', {
  id: types.identifier,
  tile: types.reference(ITile),
  items: types.array(types.reference(IItem)),
  entity: types.maybeNull(types.reference(IEntity)),
})
