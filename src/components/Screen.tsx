import * as React from 'react'
import { useGestureEvents } from '../hooks/useGestureEvents'
import { Map } from './Map'

export function Screen() {
  const rContainer = React.useRef<HTMLDivElement>(null)
  useGestureEvents(rContainer)
  return (
    <div ref={rContainer} className="screen">
      <Map />
    </div>
  )
}
