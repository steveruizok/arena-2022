import { Cell } from '../Cell'

export class Grid {
  constructor(public cells: Cell[][]) {}

  getCell(x: number, y: number): Cell {
    try {
      return this.cells[y][x]
    } catch (e) {
      throw 'Could not find cell at ' + x + ', ' + y
    }
  }
}
