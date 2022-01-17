import React from 'react'
import { Handler, useGesture, WebKitGestureEvent } from '@use-gesture/react'
import { useGame } from './useGame'
import { EventHandlerTypes } from '~types'

type GestureEvents = {
  onWheel: Handler<'wheel', WheelEvent>
  onPinchStart: Handler<'pinch', PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent>
  onPinch: Handler<'pinch', PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent>
  onPinchEnd: Handler<'pinch', PointerEvent | TouchEvent | WheelEvent | WebKitGestureEvent>
}

export function useGestureEvents(ref: React.RefObject<HTMLElement>) {
  const game = useGame()

  const events = React.useMemo<GestureEvents>(
    () => ({
      onWheel: ({ delta, event }) => {
        game.gameState.onWheel({ delta, point: game.gameState.inputs.currentScreenPoint, event })
      },
      onPinch: ({ delta, offset, origin: point, event }) => {
        game.gameState.onPinch({ delta, offset, point, event })
      },
      onPinchStart: ({ delta, offset, origin: point, event }) => {
        game.gameState.onPinchStart({ delta, offset, point, event })
      },
      onPinchEnd: ({ delta, offset, origin: point, event }) => {
        game.gameState.onPinchEnd({ delta, offset, point, event })
      },
    }),
    [game]
  )

  useGesture(events, {
    target: ref,
    eventOptions: { passive: false },
    pinch: {
      scaleBounds: { from: game.gameState.viewport.camera[2], max: 8, min: 0.1 },
    },
  })
}
