import { Cell } from '../Cell'

export class Item {
  id: string
  cell: Cell

  constructor(id: string, cell: Cell) {
    this.id = id
    this.cell = cell
  }
}
