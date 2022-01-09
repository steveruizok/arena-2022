import { Block, BlockProps } from '~lib/Block'
import { IsoBlock } from './IsoBlock'

export class StoneWall extends Block {
  static defaultProps: BlockProps = {
    id: 'stone-wall',
    type: 'stone-wall',
    point: [0, 0, 0],
    size: [1, 1, 1],
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
