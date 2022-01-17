// The level map is a grid of positions.
// Each position has a tile, up to four walls,
// an array of items, and an entity (optional).

export type ID = string

export enum Cardinal {
  North = 'north',
  East = 'east',
  South = 'south',
  West = 'west',
}

export interface IEntity {
  id: ID
  type: string
  position: number[]
}

export interface IItem {
  id: ID
  type: string
  position: number[]
}

export interface ITile {
  id: ID
  type: string
  isWalkable: boolean
}

export interface IWall {
  id: ID
  type: string
  isWalkable: boolean
}

export interface IPosition {
  tile: ID
  items: ID[]
  entity: ID | null
  walls: Record<Cardinal, string>
}

export interface ILevel {
  size: number[]
  positions: IPosition[][]
  entities: Record<IEntity['id'], IEntity>
  tiles: Record<ITile['id'], ITile>
  items: Record<IItem['id'], IItem>
  walls: Record<IWall['id'], IWall>
  templates: {
    entities: Record<IEntity['type'], IEntity>
    tiles: Record<ITile['type'], ITile>
    items: Record<IItem['type'], IItem>
    walls: Record<IWall['type'], IWall>
  }
}
