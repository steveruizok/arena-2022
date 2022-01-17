import React from 'react'
import { useGame } from './useGame'

export function useScreenEvents() {
  const game = useGame()

  const events = React.useMemo(() => {
    function getPoint(e: React.PointerEvent) {
      return [e.clientX, e.clientY]
    }

    const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
      game.gameState.onPointerMove({ point: getPoint(e), event: e })
    }

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
      game.gameState.onPointerDown({ point: getPoint(e), event: e })
    }

    const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
      game.gameState.onPointerUp({ point: getPoint(e), event: e })
    }

    return {
      onPointerMove,
      onPointerDown,
      onPointerUp,
    }
  }, [game])

  return events
}
