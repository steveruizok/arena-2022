import { rangeMap2d } from '~utils'
import { IGame as GameState } from './stores/stores'
import { UndoManager } from './UndoManager'
import { applySnapshot, getSnapshot, onSnapshot } from 'mobx-state-tree'
import { RootState, State } from './State'

export class Game extends RootState {
  gameState = GameState.create({
    level: {
      size: [10, 10],
      positions: rangeMap2d(10, 10, (x, y, i) => {
        const tile = tileLegend[levelMap[y][x] as keyof typeof tileLegend]
        const wall = wallLegend[wallMap[y][x] as keyof typeof wallLegend]
        return {
          id: i.toString(),
          tile: tile,
          items: [],
          entity: null,
          walls: {
            north: wall && wall.includes('north') ? 'stone' : null,
            east: wall && wall.includes('east') ? 'stone' : null,
            south: wall && wall.includes('south') ? 'stone' : null,
            west: wall && wall.includes('west') ? 'stone' : null,
          } as any,
        }
      }),
      entities: [],
      items: [],
      walls: [
        {
          id: 'stone',
          type: 'stone',
          isWalkable: false,
        },
      ],
      tiles: [
        {
          id: 'grass',
          type: 'grass',
          isWalkable: true,
        },
        {
          id: 'stone',
          type: 'stone',
          isWalkable: true,
        },
        {
          id: 'water',
          type: 'water',
          isWalkable: false,
        },
        {
          id: 'dirt',
          type: 'dirt',
          isWalkable: false,
        },
      ],
    },
    viewport: {
      minZoom: 0.1,
      maxZoom: 8,
      zooms: [0.1, 0.25, 0.5, 1, 2, 4, 8],
      camera: [0, 0, 1],
      offset: [0, 0],
      bounds: {
        minX: 0,
        midX: 0.5,
        maxX: 1,
        minY: 0,
        midY: 0.5,
        maxY: 1,
        width: 1,
        height: 1,
      },
    },
    inputs: {
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      spaceKey: false,
      isPinching: false,
      currentPoint: [0, 0, 0],
      currentScreenPoint: [0, 0, 0],
      currentIsoPoint: [0, 0, 0],
      currentIsoPosition: [0, 0, 0],
      previousPoint: [0, 0, 0],
      previousIsoPoint: [0, 0, 0],
      previousIsoPosition: [0, 0, 0],
      previousScreenPoint: [0, 0, 0],
      originScreenPoint: [0, 0, 0],
      originPoint: [0, 0, 0],
      state: 'idle',
      pointerIds: [],
    },
    selectedEntity: undefined,
    hoveredPosition: undefined,
    currentStateId: 'selecting',
  })

  // Undo / Redo
  undoManager = new UndoManager(this.gameState)
  undo = this.undoManager.undo
  redo = this.undoManager.undo

  // Serialize / Load serialized
  save = () => {
    return getSnapshot(this.gameState)
  }

  load = (snapshot: any) => {
    applySnapshot(this.gameState, snapshot)
  }
}

const levelMap = [
  'gd~ggggggg',
  'gd~dgggggg',
  'gg~~ddgsss',
  'ssssssssgg',
  'ggd~~dgggg',
  'dggd~dgggg',
  'gdd~~ddggg',
  'dd~~ddgggg',
  '~~~dgggggg',
  '~~~ddggggg',
]

const tileLegend = {
  g: 'grass',
  s: 'stone',
  d: 'dirt',
  '~': 'water',
}

const wallMap = [
  '..........',
  '..........',
  '..........',
  '..........',
  '..........',
  '.......┯..',
  '..........',
  '..........',
  '......┗┷..',
  '..........',
]

const wallLegend = {
  '.': undefined,
  '┓': ['north', 'east'],
  '┛': ['north', 'east'],
  '┗': ['south', 'west'],
  '┏': ['north', 'west'],
  '┯': ['north'],
  '┷': ['south'],
  '┠': ['west'],
  '	┨': ['east'],
}
