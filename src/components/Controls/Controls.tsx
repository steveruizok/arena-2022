import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useApp } from '~hooks/useApp'

export const Controls = observer(function Controls() {
  const app = useApp()
  return (
    <div className="controls">
      <pre>{`Screen Point: [${app.inputs.currentScreenPoint.map((p) => Math.floor(p)).join(', ')}] 
World Point: [${app.inputs.currentPoint.map((p) => Math.floor(p)).join(', ')}] 
Iso Point: [${app.inputs.currentIsoPoint.map((p) => Math.floor(p)).join(', ')}]
Current State:${app.currentPath}
Hovered Block: ${app.hoveredBlock?.id}
Selected Blocks: ${app.selectedBlocks?.length}
`}</pre>
    </div>
  )
})

// Hovered Adjacent: ${JSON.stringify(app.hoveredBlock?.adjacent, null, 2)}
