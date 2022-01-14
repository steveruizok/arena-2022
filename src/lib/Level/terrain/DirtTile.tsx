import { BlockProps } from '~lib/Block'
import { TerrainBlock } from './TerrainBlock'

export class DirtTile extends TerrainBlock {
  static defaultProps: BlockProps = {
    id: 'dirt',
    type: 'dirt-tile',
    point: [0, 0, 0],
    offset: [0, 0, 0.5],
    size: [1, 1, 0.5],
    facing: 'north',
    color: '#7e4f3a',
  }
}
