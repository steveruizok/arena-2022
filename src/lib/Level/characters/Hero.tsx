import { BlockProps } from '~lib/Block'
import { CharacterBlock } from './CharacterBlock'

export class Hero extends CharacterBlock {
  name = 'hero'

  static defaultProps: BlockProps = {
    id: 'hero1',
    type: 'hero',
    point: [0, 0, 1],
    offset: [0.3, 0.3, 0],
    size: [0.4, 0.4, 1.5],
    facing: 'east',
    color: 'dodgerblue',
  }
}
