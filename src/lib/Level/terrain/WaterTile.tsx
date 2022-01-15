import { BlockProps } from '~lib/Block'
import { TerrainBlock } from './TerrainBlock'

export class WaterTile extends TerrainBlock {
  static defaultProps: BlockProps = {
    id: 'water',
    type: 'water-tile',
    position: [0, 0, 0],
    offset: [0, 0, 0.5],
    size: [1, 1, 0.3],
    facing: 'north',
    color: '#26aff3',
  }

  canWalk = false
}
