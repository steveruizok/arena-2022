import { useGame } from '~hooks/useGame'
import { Controls } from './Controls'
import { Screen } from './Screen'

export function Layout() {
  const game = useGame()

  if (!game) return null

  return (
    <div className="layout">
      <Screen />
      <Controls />
    </div>
  )
}
