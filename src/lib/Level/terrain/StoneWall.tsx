import { Block, BlockProps } from '~lib/Block'
import { IsoBlock } from './components/IsoBlock'

export class StoneWall extends Block {
  static defaultProps: BlockProps = {
    id: 'stone-wall',
    type: 'stone-wall',
    point: [0, 0, 0],
    offset: [0, 0, 0],
    size: [1, 1, 1],
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
