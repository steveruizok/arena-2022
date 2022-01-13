import { Block, BlockProps } from '~lib/Block'
import { IsoBlock } from './components/IsoBlock'

export class StoneTile extends Block {
  static defaultProps: BlockProps = {
    id: 'stone-tile',
    type: 'stone-tile',
    point: [0, 0, 0],
    offset: [0, 0, 0.5],
    size: [1, 1, 0.5],
    facing: 'north',
    color: '#cccccc',
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
