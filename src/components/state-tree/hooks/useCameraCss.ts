import { autorun } from 'mobx'
import React from 'react'
import { useGame } from './useGame'

export function useCameraCss<T extends HTMLElement | SVGElement>(ref: React.RefObject<T>) {
  const game = useGame()
  React.useLayoutEffect(() => {
    autorun(() => {
      const {
        offset,
        camera: [cx, cy, cz],
      } = game.gameState.viewport
      const elm = ref.current
      if (!elm) return
      elm.style.setProperty(
        'transform',
        `scale(${cz}) 
         translate(${cx + offset[0]}px, ${cy + offset[1]}px)`
      )
    })
  }, [game, ref])
}
