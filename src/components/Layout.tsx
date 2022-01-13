import { useApp } from '~hooks/useApp'
import { Controls } from './Controls'
import { Screen } from './Screen'

export function Layout() {
  const app = useApp()

  if (!app) return null

  return (
    <div className="layout">
      <Screen />
      <Controls />
    </div>
  )
}
