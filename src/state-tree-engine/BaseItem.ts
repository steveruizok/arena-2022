import { computed } from 'mobx'
import { Engine } from './Engine'

export class BaseItem {
  id: string
  engine: Engine

  constructor(id: string, engine: Engine) {
    this.id = id
    this.engine = engine
  }

  @computed get props() {
    return this.engine.level.items[this.id]
  }
}
