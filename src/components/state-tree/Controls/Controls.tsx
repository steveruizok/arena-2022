import { observer } from 'mobx-react-lite'
import { useGame } from '~hooks/useGame'

export const Controls = observer(function Controls() {
  const game = useGame()
  return (
    <div className="controls">
      <pre>{`Screen Point: [${game.gameState.inputs.currentScreenPoint
        .map((p) => Math.floor(p))
        .join(', ')}] 
World Point: [${game.gameState.inputs.currentPoint.map((p) => Math.floor(p)).join(', ')}] 
Iso Point: [${game.gameState.inputs.currentIsoPoint.map((p) => p.toFixed(2))}]
Iso Position: [${game.gameState.inputs.currentIsoPosition}]
`}</pre>
    </div>
  )
})

// Hovered Adjacent: ${JSON.stringify(game.hoveredBlock?.adjacent, null, 2)}
// Current State:${game.currentPath}
// Hovered Block: ${game.hoveredBlock?.id}
// Selected Blocks: ${game.selectedBlocks?.length}
