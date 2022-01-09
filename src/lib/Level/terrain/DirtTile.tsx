import { Block, BlockProps } from '~lib/Block'
import { IsoBlock } from './IsoBlock'

export class DirtTile extends Block {
  static defaultProps: BlockProps = {
    id: 'dirt',
    type: 'dirt-tile',
    point: [0, 0, 0],
    size: [1, 1, 0.5],
    facing: 'north',
    color: '#7e4f3a',
  }

  Component = () => {
    const {
      verts,
      props: { color },
    } = this
    return <IsoBlock color={color} verts={verts} />
  }
}
