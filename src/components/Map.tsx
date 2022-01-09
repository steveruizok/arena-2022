import * as React from 'react'
import { Tile } from './Tile'
import { Block } from './Block'
import { useApp } from '../hooks/useApp'
import { Observer } from 'mobx-react-lite'
import { SIZE } from '../utils/iso'
import { useResizeObserver } from '../hooks/useResizeObserver'
import { useCameraCss } from '../hooks/useCameraCss'

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
              {Object.keys(app.state.tiles).map((id) => (
                <Tile key={id} id={id} />
              ))}
              {Object.keys(app.state.blocks).map((id) => (
                <Block key={id} id={id} />
              ))}
            </g>
          )}
        </Observer>
      </g>
    </svg>
  )
})
