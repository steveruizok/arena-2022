import { types, applySnapshot, onSnapshot, IStateTreeNode, IType } from 'mobx-state-tree'

// Undo / Redo

export class UndoManager<S, T extends IStateTreeNode<IType<any, S, any>>> {
  store: T
  states: S[] = []
  currentFrame = -1

  constructor(store: T) {
    this.store = store
    onSnapshot(store, (snapshot) => {
      if (this.currentFrame === this.states.length - 1) {
        this.states.push(snapshot)
        this.currentFrame++
      }
    })
  }

  undo() {
    if (this.currentFrame === 0) return
    this.currentFrame--
    applySnapshot(this.store, this.states[this.currentFrame])
  }

  redo() {
    if (this.currentFrame === this.states.length - 1) return
    this.currentFrame++
    applySnapshot(this.store, this.states[this.currentFrame])
  }
}
