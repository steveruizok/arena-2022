import { observer } from 'mobx-react-lite'
import { useApp } from '~hooks/useApp'

export const Controls = observer(function Controls() {
  const app = useApp()
  return (
    <div className="controls">
      <pre>{`Screen Point: [${app.inputs.currentScreenPoint.map((p) => Math.floor(p)).join(', ')}] 
World Point: [${app.inputs.currentPoint.map((p) => Math.floor(p)).join(', ')}] 
Iso Point: [${app.inputs.currentIsoPoint.map((p) => p.toFixed(2))}]
Iso Position: [${app.inputs.currentIsoPosition}]
Hovered Block: ${app.hoveredBlock?.id}
Selected Blocks: ${app.selectedBlocks?.length}
`}</pre>
    </div>
  )
})

// Hovered Adjacent: ${JSON.stringify(game.hoveredBlock?.adjacent, null, 2)}
