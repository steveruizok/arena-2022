import { types } from 'mobx-state-tree'

export const IState = types.model('State', {
  id: types.identifier,
})

export const IStateChart = types.model({
  currentState: types.reference(IState),
  states: types.array(IState),
})
