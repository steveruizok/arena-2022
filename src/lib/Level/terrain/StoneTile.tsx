import { Block, BlockProps } from '~lib/Block'
import { IsoBlock } from './IsoBlock'

export class StoneTile extends Block {
  static defaultProps: BlockProps = {
    id: 'stone-tile',
    type: 'stone-tile',
    point: [0, 0, 0],
    size: [1, 1, 0.5],
    facing: 'north',
    color: '#cccccc',
  }

  Component = () => {
    const {
      verts,
      props: { color },
    } = this
    return <IsoBlock color={color} verts={verts} />
  }
}
