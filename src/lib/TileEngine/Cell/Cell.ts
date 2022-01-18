import { makeObservable, observable } from 'mobx'
import { Entity } from '~lib/TileEngine/Entity'
import { Item } from '~lib/TileEngine/Item'
import { Tile } from '../Tile'

export class Cell {
  id: string
  x: number
  y: number
  @observable tile: Tile
  @observable items: Item[]
  @observable entity: Entity | null

  constructor(
    id: string,
    x: number,
    y: number,
    tile: Tile,
    items: Item[] = [],
    entity: Entity | null = null
  ) {
    this.id = id
    this.x = x
    this.y = y
    this.tile = tile
    this.items = items
    this.entity = entity
    makeObservable(this)
  }
}
