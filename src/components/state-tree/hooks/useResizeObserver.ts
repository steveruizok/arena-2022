import * as React from 'react'
import { Bounds } from '~types'
import { useGame } from './useGame'

export function useResizeObserver<T extends Element>(
  ref: React.RefObject<T>,
  onBoundsChange?: (bounds: Bounds) => void
) {
  const game = useGame()
  const rIsMounted = React.useRef(false)

  // When the element resizes, update the bounds (stored in inputs)
  // and broadcast via the onBoundsChange callback prop.
  const updateBounds = React.useCallback(() => {
    if (rIsMounted.current) {
      const rect = ref.current?.getBoundingClientRect()

      if (rect) {
        const bounds: Bounds = {
          minX: rect.left,
          midX: rect.left + rect.width / 2,
          maxX: rect.left + rect.width,
          midY: rect.top + rect.height / 2,
          minY: rect.top,
          maxY: rect.top + rect.height,
          width: rect.width,
          height: rect.height,
        }

        game.gameState.viewport.updateBounds(bounds)
        onBoundsChange?.(bounds)
      }
    } else {
      // Skip the first mount
      rIsMounted.current = true
    }
  }, [game, ref, onBoundsChange])

  React.useEffect(() => {
    window.addEventListener('scroll', updateBounds)
    window.addEventListener('resize', updateBounds)
    return () => {
      window.removeEventListener('scroll', updateBounds)
      window.removeEventListener('resize', updateBounds)
    }
  }, [])

  React.useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0].contentRect) {
        updateBounds()
      }
    })

    if (ref.current) {
      resizeObserver.observe(ref.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [ref])

  React.useLayoutEffect(() => {
    updateBounds()
  }, [ref])
}
