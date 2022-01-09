import { autorun, reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useApp } from '../hooks/useApp'

interface BlockProps {
  id: string
}

export const Block = observer(function Block({ id }: BlockProps) {
  const app = useApp()
  const block = app.state.blocks[id]
  const { rightDown, frontUp, frontDown, leftDown, backUp, rightUp, leftUp, centerDown } =
    block.verts
  return (
    <g strokeWidth={1} onPointerEnter={() => block.move([0, 0, 1])}>
      <polygon
        points={[backUp, rightUp, rightDown, frontDown, leftDown, leftUp].join(' ')}
        fill="#999"
      />
      <polygon points={[frontUp, frontDown, leftDown, leftUp].join(' ')} fill="rgba(0,0,0,.2)" />
      <polygon
        points={[rightUp, rightDown, frontDown, frontUp].join(' ')}
        fill="rgba(255, 255, 255, 0)"
      />
      <polygon
        points={[backUp, rightUp, frontUp, leftUp].join(' ')}
        fill="rgba(255, 255, 255, .5)"
      />
      <polyline
        points={[frontDown, frontUp, leftUp, frontUp, rightUp].join(' ')}
        fill="none"
        stroke="rgba(255, 255, 255, .5)"
      />
      <ellipse cx={frontUp[0]} cy={frontUp[1]} rx={1} ry={1} fill="rgba(255, 255, 255, .7)" />
      <polygon
        points={[backUp, rightUp, rightDown, frontDown, leftDown, leftUp].join(' ')}
        fill={`rgba(255, 255, 255, ${block.props.point[2] * 0.2 * 0.2})`}
        stroke="#000"
      />
    </g>
  )
})
