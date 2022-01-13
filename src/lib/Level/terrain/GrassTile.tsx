import { observer } from 'mobx-react-lite'
import { Block, BlockProps } from '~lib/Block'
import { IsoBlock } from './components/IsoBlock'

export class GrassTile extends Block {
  static defaultProps: BlockProps = {
    id: 'grass',
    type: 'grass-tile',
    point: [0, 0, 0],
    offset: [0, 0, 0.5],
    size: [1, 1, 0.5],
    facing: 'north',
    color: '#648949',
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
