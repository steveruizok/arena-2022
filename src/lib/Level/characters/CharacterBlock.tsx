import React from 'react'
import { Block, BlockProps } from '~lib/Block'

export interface CharacterProps extends BlockProps {}

export class CharacterBlock extends Block {
  canSelect = true
  canHover = true

  Component = Block.Component(({ isHovered, isSelected }) => {
    const {
      adjacent,
      verts,
      props: { color },
    } = this
    const { rightDown, frontUp, frontDown, leftDown, backUp, rightUp, leftUp } = verts
    const rContainer = React.useRef<SVGGElement>(null)
    const outline = [backUp, rightUp, rightDown, frontDown, leftDown, leftUp].join(' ')
    return (
      <g strokeLinecap="round" strokeLinejoin="round" ref={rContainer} strokeWidth={1}>
        <polygon points={[frontUp, frontDown, leftDown, leftUp].join(' ')} fill="rgba(0,0,0,.2)" />
        <polygon
          points={[rightUp, rightDown, frontDown, frontUp].join(' ')}
          fill="rgba(0,0,0,.1)"
        />
        <polygon points={outline} fill={color} stroke="rgba(0,0,0,1)" />
        <path
          d={`M ${leftUp} L ${frontUp} ${rightUp} M ${frontUp} L ${frontDown}`}
          strokeWidth={1}
          fill="none"
          stroke="white"
          opacity={0.4}
        />
        <ellipse
          cx={frontUp[0]}
          cy={frontUp[1]}
          rx={1}
          ry={1}
          fill="white"
          stroke="none"
          opacity={0.5}
        />
        {isSelected && <polygon points={outline} fill={'none'} stroke="yellow" />}
      </g>
    )
  })

  Indicator = Block.Indicator(() => {
    const {
      verts: { backUp, rightUp, frontUp, leftUp },
    } = this
    return (
      <g fill={'none'} strokeLinejoin="round">
        <polygon points={this.outline.join(' ')} stroke="black" strokeWidth={3} />
        <polygon points={this.outline.join(' ')} stroke={'orange'} strokeWidth={1.5} />
      </g>
    )
  })
}
