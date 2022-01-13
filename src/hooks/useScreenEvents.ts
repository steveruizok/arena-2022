import React from 'react'
import { useApp } from './useApp'

export function useScreenEvents() {
  const app = useApp()

  const events = React.useMemo(() => {
    function getPoint(e: React.PointerEvent) {
      const {
        viewport: {
          camera: { zoom },
          offset,
        },
      } = app
      return [e.clientX, e.clientY]
    }

    const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
      app.send('onPointerMove', { block: null, point: getPoint(e), event: e })
    }

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
      app.send('onPointerDown', { block: null, point: getPoint(e), event: e })
    }

    const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
      app.send('onPointerUp', { block: null, point: getPoint(e), event: e })
    }

    return {
      onPointerMove,
      onPointerDown,
      onPointerUp,
    }
  }, [app])

  return events
}
