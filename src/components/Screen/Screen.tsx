import * as React from 'react'
import { useApp } from '~hooks/useApp'
import { useGestureEvents } from '~hooks/useGestureEvents'
import { Map } from './Map'

export function Screen() {
  const rContainer = React.useRef<HTMLDivElement>(null)
  useGestureEvents(rContainer)
  const app = useApp()
  const onPointerMove = React.useCallback<React.PointerEventHandler>((event) => {
    app.send('onPointerMove', { event })
  }, [])
  return (
    <div ref={rContainer} className="screen" onPointerMove={onPointerMove}>
      <Map />
    </div>
  )
}
