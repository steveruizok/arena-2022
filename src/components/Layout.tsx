import * as React from 'react'
import { Controls } from './Controls'
import { Screen } from './Screen'

export function Layout() {
  return (
    <div className="layout">
      <Screen />
      <Controls />
    </div>
  )
}
