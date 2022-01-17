import { types } from 'mobx-state-tree'

export const IEntity = types.model('Entity', {
  id: types.identifier,
  type: types.string,
  position: types.array(types.number),
  offset: types.array(types.number),
})
