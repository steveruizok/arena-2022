import React from 'react'
import { useGesture } from '@use-gesture/react'
import { useApp } from './useApp'
import { EventHandlerTypes } from '~types'

type GestureEvents = {
  onWheel: EventHandlerTypes['wheel']
  onPinchStart: EventHandlerTypes['pinch']
  onPinch: EventHandlerTypes['pinch']
  onPinchEnd: EventHandlerTypes['pinch']
}

export function useGestureEvents(ref: React.RefObject<HTMLElement>) {
  const app = useApp()

  const events = React.useMemo<GestureEvents>(
    () => ({
      onWheel: ({ delta, event }) => {
        app.send('onWheel', { delta, event })
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
    []
  )

  useGesture(events, {
    target: ref,
    eventOptions: { passive: false },
    pinch: {
      scaleBounds: { from: app.viewport.camera.zoom, max: 8, min: 0.1 },
    },
  })
}
