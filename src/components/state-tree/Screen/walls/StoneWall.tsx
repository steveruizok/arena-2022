import { Cardinal } from '~state-tree-engine/types'
import { Wall } from './Wall'

export function StoneWall({ direction }: { direction: Cardinal }) {
  return <Wall color="lightGray" direction={direction} />
}
