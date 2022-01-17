import { getBlockPaths, getBlockVerts } from '~utils/iso'
import { ColorName, COLORS } from '~utils/colors'
import { Cardinal } from '~state-tree-engine/types'

export interface WallProps {
  color: ColorName
  direction: Cardinal
  height?: number
}

export function Wall({ color, direction, height = 2 }: WallProps) {
  const verts = getBlockVerts([0, 0, 1], [0, 0, 0], [1, 1, height])
  const paths = getBlockPaths(verts)
  return <path d={paths[direction]} fill={COLORS[`${color}30`]} stroke={COLORS[`${color}20`]} />
}
