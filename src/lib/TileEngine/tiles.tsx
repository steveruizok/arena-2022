import { Tile } from './Tile'

export const tiles: Record<string, Tile> = {
  grass: {
    id: 'grass',
    isWalkable: true,
    height: 1,
    Tile: () => <g />,
  },
  stone: {
    id: 'stone',
    isWalkable: true,
    height: 1,
    Tile: () => <g />,
  },
  water: {
    id: 'water',
    isWalkable: false,
    height: 0.6,
    Tile: () => <g />,
  },
}
