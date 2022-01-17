import { Instance, types } from 'mobx-state-tree'
import { IEntity } from './IEntity'
import { IItem } from './IItem'
import { IPosition } from './IPosition'
import { ITile } from './ITile'
import { IWall } from './IWall'

export const ILevel = types
  .model('Level', {
    size: types.array(types.number),
    positions: types.array(types.array(IPosition)),
    entities: types.array(IEntity),
    tiles: types.array(ITile),
    walls: types.array(IWall),
    items: types.array(IItem),
  })
  .extend((self) => {
    // Views
    const getPosition = (isoPoint: number[]): Instance<typeof IPosition> | undefined => {
      if (
        isoPoint[0] < 0 ||
        isoPoint[0] > self.size[0] ||
        isoPoint[1] < 0 ||
        isoPoint[1] > self.size[1]
      ) {
        return undefined
      }
      return self.positions[isoPoint[1]][isoPoint[0]]
    }

    return {
      views: {
        getPosition,
      },
    }
  })
