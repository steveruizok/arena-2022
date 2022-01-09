import { autorun, reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useApp } from '../hooks/useApp'

interface TileProps {
  id: string
}

export const Tile = observer(function Tile({ id }: TileProps) {
  const app = useApp()
  const Tile = app.state.tiles[id]
  const { backDown, rightDown, frontDown, leftDown } = Tile.verts
  return (
    <g strokeWidth={1}>
      <polygon points={[backDown, rightDown, frontDown, leftDown].join(' ')} fill="#ccc" />

      <polyline
        points={[leftDown, frontDown, rightDown].join(' ')}
        stroke="#aaa"
        fill="none"
        strokeWidth={2}
      />
    </g>
  )
})
