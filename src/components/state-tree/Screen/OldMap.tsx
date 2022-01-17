import * as React from 'react'
import { useApp } from '~hooks/useApp'
import { Observer } from 'mobx-react-lite'
import { useCameraCss } from '~hooks/useCameraCss'
import { PathIndicator } from './PathIndicator'

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
              {app.level.blocks.map((layer, z) => {
                return (
                  <React.Fragment key={z}>
                    {layer.map((row) =>
                      row.map(
                        (block) =>
                          block && (
                            <g key={block.id}>
                              <block.Component
                                isHovered={block === app.hoveredBlock}
                                isSelected={app.state.selectedIds.has(block.props.id)}
                              />
                              {app.selectedBlocks?.includes(block) && (
                                <block.Indicator isHovered={false} isSelected={true} />
                              )}
                              {block === app.hoveredBlock && (
                                <block.Indicator isHovered={true} isSelected={false} />
                              )}
                            </g>
                          )
                      )
                    )}
                    {z === 0 &&
                      app.state.paths.map((path, i) =>
                        path.map((point, j) => (
                          <PathIndicator key={`${i}_${j}`} point={app.viewport.isoToWorld(point)} />
                        ))
                      )}
                  </React.Fragment>
                )
              })}
              <g opacity={0.2}>
                {app.state.paths.map((path, i) =>
                  path.map((point, j) => (
                    <PathIndicator key={`${i}_${j}`} point={app.viewport.isoToWorld(point)} />
                  ))
                )}
                {app.hoveredBlock && (
                  <app.hoveredBlock.Indicator
                    key={app.hoveredBlock.id + '_hover2'}
                    isHovered={true}
                    isSelected={false}
                  />
                )}
                {app.selectedBlocks.map((block) => (
                  <block.Indicator
                    key={block.id + '_select2'}
                    isHovered={false}
                    isSelected={true}
                  />
                ))}
              </g>
            </g>
          )}
        </Observer>
      </g>
    </svg>
  )
})
