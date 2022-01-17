import * as React from 'react'
import { useGestureEvents } from '~hooks/useGestureEvents'
import { useScreenEvents } from '~hooks/useScreenEvents'
import { useResizeObserver } from '~hooks/useResizeObserver'
import { Map } from './Map'

export function Screen() {
  const rContainer = React.useRef<HTMLDivElement>(null)

  useGestureEvents(rContainer)

  useResizeObserver(rContainer)

  const events = useScreenEvents()

  return (
    <div ref={rContainer} className="screen" {...events}>
      <Map />
    </div>
  )
}
