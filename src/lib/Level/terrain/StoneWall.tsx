import { BlockProps } from '~lib/Block'
import { TerrainBlock } from './TerrainBlock'

export class StoneWall extends TerrainBlock {
  static defaultProps: BlockProps = {
    id: 'stone-wall',
    type: 'stone-wall',
    position: [0, 0, 0],
    offset: [0, 0, 0],
    size: [1, 1, 1],
    facing: 'north',
    color: '#cccccc',
  }

  canWalk = false
}
