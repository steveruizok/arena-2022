import { Verts } from '~types'

interface IsoBlockProps {
  color: string
  verts: Verts
}

export function IsoBlock({ verts, color }: IsoBlockProps) {
  const { rightDown, frontUp, frontDown, leftDown, backUp, rightUp, leftUp } = verts
  return (
    <g strokeWidth={1}>
      <polygon
        points={[backUp, rightUp, rightDown, frontDown, leftDown, leftUp].join(' ')}
        fill={color}
      />
      <polygon points={[frontUp, frontDown, leftDown, leftUp].join(' ')} fill="rgba(0,0,0,.2)" />
      <polygon points={[rightUp, rightDown, frontDown, frontUp].join(' ')} fill="rgba(0,0,0,.1)" />
      <polygon
        points={[backUp, rightUp, frontUp, leftUp].join(' ')}
        fill="rgba(255, 255, 255, .1)"
      />
      <polyline
        points={[frontDown, frontUp, leftUp, frontUp, rightUp].join(' ')}
        fill="none"
        stroke="rgba(255, 255, 255, .5)"
      />
      <ellipse cx={frontUp[0]} cy={frontUp[1]} rx={1} ry={1} fill="rgba(255, 255, 255, .7)" />
      <polygon
        points={[backUp, rightUp, rightDown, frontDown, leftDown, leftUp].join(' ')}
        fill={'none'}
        stroke="#000"
      />
    </g>
  )
}
