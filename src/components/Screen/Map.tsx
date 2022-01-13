import * as React from 'react'
import { useApp } from '~hooks/useApp'
import { Observer } from 'mobx-react-lite'
import { useCameraCss } from '~hooks/useCameraCss'
import { Vec3d } from '~utils/vec3d'

export const Map = React.memo(function Map() {
  const app = useApp()

  const rContainer = React.useRef<SVGGElement>(null)

  useCameraCss(rContainer)

  return (
    <svg className="map">
      <g ref={rContainer}>
        <Observer>
          {() => (
            <g>
              {app.state.level.blocksArray.map((block, z) => (
                <block.Component
                  key={block.id}
                  isHovered={block === app.hoveredBlock}
                  isSelected={false}
                />
              ))}
              {app.hoveredBlock && (
                <app.hoveredBlock.Indicator isHovered={true} isSelected={false} />
              )}
            </g>
          )}
        </Observer>
      </g>
    </svg>
  )
})
