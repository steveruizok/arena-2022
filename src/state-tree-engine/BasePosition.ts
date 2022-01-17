import { computed } from 'mobx'
import { Engine } from './Engine'

export class BasePosition {
  id: number[]
  engine: Engine

  constructor(id: number[], engine: Engine) {
    this.id = id
    this.engine = engine
  }

  @computed get props() {
    const [x, y] = this.id
    return this.engine.level.positions[x][y]
  }
}
