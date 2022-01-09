import * as React from 'react'
import { useApp } from '~hooks/useApp'
import { Observer } from 'mobx-react-lite'
import { SIZE } from '~utils/iso'
import { useResizeObserver } from '~hooks/useResizeObserver'
import { useCameraCss } from '~hooks/useCameraCss'

export const Map = React.memo(function Map() {
  const app = useApp()
  const rContainer = React.useRef<SVGGElement>(null)
  useResizeObserver(rContainer)
  useCameraCss(rContainer)
  return (
    <svg className="map">
      <g ref={rContainer}>
        <Observer>
          {() => (
            <g transform={`translate(${SIZE * 10.5}, ${SIZE * 5})`}>
              {Object.values(app.state.tiles).map((tile) => (
                <tile.Component key={tile.id} />
              ))}
              {Object.values(app.state.blocks).map((block) => (
                <block.Component key={block.id} />
              ))}
            </g>
          )}
        </Observer>
      </g>
    </svg>
  )
})
