import { getBlockPaths, getBlockVerts } from '~utils/iso'
import { ColorName, COLORS } from '~utils/colors'

export interface TileProps {
  color: ColorName
  height?: number
}

export function Tile({ color, height = 1 }: TileProps) {
  const verts = getBlockVerts([0, 0, 0], [0, 0, 0], [1, 1, height])
  const paths = getBlockPaths(verts)
  return (
    <g>
      <path d={paths.outline} fill={COLORS[`${color}50`]} stroke={COLORS[`${color}50`]} />
      <path d={paths.top} fill={COLORS[`${color}50`]} stroke={COLORS[`${color}40`]} />
      <path d={paths.south} fill={COLORS[`${color}30`]} stroke={COLORS[`${color}20`]} />
      <path d={paths.east} fill={COLORS[`${color}40`]} stroke={COLORS[`${color}30`]} />
    </g>
  )
}
