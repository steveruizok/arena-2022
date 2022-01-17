import { types } from 'mobx-state-tree'

export const IItem = types.model('Item', {
  id: types.identifier,
  type: types.string,
})
