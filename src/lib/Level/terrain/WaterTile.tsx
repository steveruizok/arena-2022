import { Block, BlockProps } from '~lib/Block'
import { IsoBlock } from './components/IsoBlock'

export class WaterTile extends Block {
  static defaultProps: BlockProps = {
    id: 'water',
    type: 'water-tile',
    point: [0, 0, 0],
    offset: [0, 0, 0.5],
    size: [1, 1, 0.3],
    facing: 'north',
    color: '#26aff3',
  }

  Component = Block.Component(({ isHovered }) => {
    const {
      adjacent,
      verts,
      props: { color },
    } = this
    return (
      <IsoBlock
        color={color}
        verts={verts}
        adjacent={adjacent}
        outline={isHovered ? 'red' : undefined}
      />
    )
  })
}
