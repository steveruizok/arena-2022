import { BlockProps } from '~lib/Block'
import { TerrainBlock } from './TerrainBlock'

export class GrassTile extends TerrainBlock {
  static defaultProps: BlockProps = {
    id: 'grass',
    type: 'grass-tile',
    position: [0, 0, 0],
    offset: [0, 0, 0.5],
    size: [1, 1, 0.5],
    facing: 'north',
    color: '#648949',
  }

  canWalk = true
}
