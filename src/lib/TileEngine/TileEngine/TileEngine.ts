import { makeObservable } from 'mobx'
import { rangeMap2d } from '~utils'
import { Cell } from '../Cell'
import { Grid } from '../Grid'
import { tiles } from '../tiles'

export class TileEngine {
  constructor() {
    makeObservable(this)
  }

  grid = new Grid(rangeMap2d(10, 10, (x, y, i) => new Cell(i.toString(), x, y, tiles.grass)))
}
