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
              {app.state.level.blocksArray.map((block) => (
                <block.Component
                  key={block.id}
                  isHovered={block === app.hoveredBlock}
                  isSelected={app.state.selectedIds.has(block.props.id)}
                />
              ))}
              {app.hoveredBlock && (
                <app.hoveredBlock.Indicator isHovered={true} isSelected={false} />
              )}
              {app.selectedBlocks.map((block) => (
                <block.Indicator key={block.id} isHovered={false} isSelected={true} />
              ))}
            </g>
          )}
        </Observer>
      </g>
    </svg>
  )
})
