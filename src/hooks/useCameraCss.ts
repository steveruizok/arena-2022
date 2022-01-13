import { autorun } from 'mobx'
import React from 'react'
import { DIMENSIONS } from '~utils/iso'
import { useApp } from './useApp'

export function useCameraCss<T extends HTMLElement | SVGElement>(ref: React.RefObject<T>) {
  const app = useApp()
  React.useLayoutEffect(() => {
    autorun(() => {
      const {
        offset,
        bounds,
        camera: {
          zoom,
          point: [x, y],
        },
      } = app.viewport
      const elm = ref.current
      if (!elm) return
      elm.style.setProperty(
        'transform',
        `scale(${zoom}) 
         translate(${x + offset[0]}px, ${y + offset[1]}px)`
      )
    })
  }, [ref])
}
