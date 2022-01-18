import { makeObservable, observable } from 'mobx'
import { Cell } from '../Cell'
import { Item } from '../Item'

export class Entity {
  id: string
  @observable cell: Cell
  @observable items: Item[]

  constructor(id: string, cell: Cell, items: Item[] = []) {
    this.id = id
    this.cell = cell
    this.items = items
    makeObservable(this)
  }
}
