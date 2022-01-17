import { action, observable } from 'mobx'
import { BaseEntity } from './BaseEntity'
import { BasePosition } from './BasePosition'
import { ILevel } from './types'

export class Engine {
  @observable level: ILevel
  @observable positions: BasePosition[][] = []
  @observable entities = new Map<string, BaseEntity>([])

  constructor(level: ILevel) {
    this.level = level
  }

  addEntity(type: string, position: number[]) {
    const entity = this.level.templates.entities[type]
    this.level.entities[entity.id] = entity
    this.level.positions[position[0]][position[1]].entity = entity.id
  }

  @action updateEntity<T extends BaseEntity>(id: string, changes: Partial<T>) {
    Object.assign(this.level.entities[id], changes)
    return this
  }
}
