import { getBlockPaths, getBlockVerts, getTopPath } from '~utils/iso'
import { ColorName, COLORS } from '~utils/colors'

const outerPath = getTopPath(1.5)
const innerPath = getTopPath(1.5)

export interface TileProps {}

export function HoverIndicator() {
  return (
    <g>
      <path d={outerPath} fill="none" strokeWidth={3} stroke={COLORS[`black50`]} />
      <path d={innerPath} fill="none" stroke={COLORS[`yellow40`]} />
    </g>
  )
}
