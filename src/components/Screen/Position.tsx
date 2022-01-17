import { observer } from 'mobx-react-lite'
import { Cardinal } from '~state-tree-engine/types'
import { useGame } from '~hooks/useGame'
import { HoverIndicator } from './HoverIndicator'
import { tiles } from './tiles'
import { walls } from './walls'

export interface PositionProps {
  x: number
  y: number
}

export const Position = observer(function Position({ x, y }: PositionProps) {
  const game = useGame()
  const { level, hoveredPosition } = game.gameState

  const position = game.gameState.level.positions[y][x]
  const point = game.gameState.viewport.isoToWorld([x, y, -1])
  const TileComponent = tiles[position.tile.type]
  // const WallComponents: Record<Cardinal, typeof walls[keyof typeof walls] | null | undefined> = {
  //   [Cardinal.North]:
  //     position.walls.get('north') &&
  //     walls[game.gameState.level.walls.get(position.walls.get('north')!)!.type],
  //   [Cardinal.West]:
  //     position.walls.get('west') &&
  //     walls[game.gameState.level.walls.get(position.walls.get('west')!)!.type],
  //   [Cardinal.East]:
  //     position.walls.get('east') &&
  //     walls[game.gameState.level.walls.get(position.walls.get('east')!)!.type],
  //   [Cardinal.South]:
  //     position.walls.get('south') &&
  //     walls[game.gameState.level.walls.get(position.walls.get('south')!)!.type],
  // }

  const isHovered = hoveredPosition === position

  return (
    <g transform={`translate(${point})`}>
      <TileComponent />
      {isHovered && <HoverIndicator />}
      {/* {Object.entries(WallComponents).map(
        ([direction, Component], i) =>
          Component && <Component key={i} direction={direction as Cardinal} />
      )} */}
    </g>
  )
})
