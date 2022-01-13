import React from 'react'
import { AdjacentBlocks } from '~lib/Block'
import { Verts } from '~types'
import { Vec3d } from '~utils/vec3d'

interface IsoBlockProps {
  color: string
  adjacent: AdjacentBlocks
  verts: Verts
  outline?: string
}

export function IsoBlock({ verts, adjacent, color, outline }: IsoBlockProps) {
  const { rightDown, frontUp, frontDown, leftDown, backUp, rightUp, leftUp } = verts

  const rContainer = React.useRef<SVGGElement>(null)

  return (
    <g ref={rContainer} strokeWidth={1}>
      <polygon
        points={[backUp, rightUp, rightDown, frontDown, leftDown, leftUp].join(' ')}
        fill={color}
        stroke="rgba(0,0,0,.1)"
      />
      <polygon points={[frontUp, frontDown, leftDown, leftUp].join(' ')} fill="rgba(0,0,0,.2)" />
      <polygon points={[rightUp, rightDown, frontDown, frontUp].join(' ')} fill="rgba(0,0,0,.1)" />
      <g fill={'none'} stroke={'rgba(0,0,0,.62)'}>
        {!adjacent.north && <polyline points={[backUp, rightUp].join(' ')} />}
        {!adjacent.west && <polyline points={[backUp, leftUp].join(' ')} />}
        {!(adjacent.west || adjacent.southWest || adjacent.south) && (
          <polyline points={[leftUp, leftDown].join(' ')} />
        )}
        {!(adjacent.east || adjacent.northEast || adjacent.north) && (
          <polyline points={[rightDown, rightUp].join(' ')} />
        )}
        {!(adjacent.east || adjacent.below) && (
          <polyline points={[frontDown, rightDown].join(' ')} />
        )}
        {!(adjacent.south || adjacent.below) && (
          <polyline points={[leftDown, frontDown].join(' ')} />
        )}
        <g stroke="rgba(255, 255, 255, .4)">
          {!adjacent.south && <polyline points={[leftUp, frontUp].join(' ')} />}
          {!adjacent.east && <polyline points={[frontUp, rightUp].join(' ')} />}
          {!(adjacent.south || adjacent.east || adjacent.southEast) && (
            <>
              <polyline points={[frontUp, frontDown].join(' ')} />
              <ellipse
                cx={frontUp[0]}
                cy={frontUp[1]}
                rx={1}
                ry={1}
                fill={'rgba(255, 255, 255, .35)'}
                stroke="none"
              />
            </>
          )}
        </g>
      </g>
    </g>
  )
}
