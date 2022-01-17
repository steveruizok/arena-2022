import React from 'react'
import { Handler, useGesture, WebKitGestureEvent } from '@use-gesture/react'
import { useApp } from './useApp'

type GestureEvents = {
  onWheel: Handler<'wheel', WheelEvent>
  onPinchStart: Handler<'pinch', PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent>
  onPinch: Handler<'pinch', PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent>
  onPinchEnd: Handler<'pinch', PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent>
}

export function useGestureEvents(ref: React.RefObject<HTMLElement>) {
  const app = useApp()

  const events = React.useMemo<GestureEvents>(
    () => ({
      onWheel: ({ delta, event }) => {
        app.send('onWheel', { delta, point: app.inputs.currentScreenPoint, event })
      },
      onPinch: ({ delta, offset, origin: point, event }) => {
        app.send('onPinch', { delta, offset, point, event })
      },
      onPinchStart: ({ delta, offset, origin: point, event }) => {
        app.send('onPinchStart', { delta, offset, point, event })
      },
      onPinchEnd: ({ delta, offset, origin: point, event }) => {
        app.send('onPinchEnd', { delta, offset, point, event })
      },
    }),
    [app]
  )

  useGesture(events, {
    target: ref,
    eventOptions: { passive: false },
    pinch: {
      scaleBounds: { from: app.viewport.camera.zoom, max: 8, min: 0.1 },
    },
  })
}
