import { BlockProps } from '~lib/Block'
import { TerrainBlock } from './TerrainBlock'

export class StoneTile extends TerrainBlock {
  static defaultProps: BlockProps = {
    id: 'stone-tile',
    type: 'stone-tile',
    position: [0, 0, 0],
    offset: [0, 0, 0.5],
    size: [1, 1, 0.5],
    facing: 'north',
    color: '#cccccc',
  }

  canWalk = true
}
