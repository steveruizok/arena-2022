import { Block, BlockProps } from '~lib/Block'
import { IsoBlock } from './IsoBlock'

export class WaterTile extends Block {
  static defaultProps: BlockProps = {
    id: 'water',
    type: 'water-tile',
    point: [0, 0, 0],
    size: [1, 1, 0.3],
    facing: 'north',
    color: '#26aff3',
  }

  Component = () => {
    const {
      verts,
      props: { color },
    } = this
    return <IsoBlock color={color} verts={verts} />
  }
}
