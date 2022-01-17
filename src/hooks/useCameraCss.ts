import { autorun } from 'mobx'
import React from 'react'
import { useApp } from './useApp'

export function useCameraCss<T extends HTMLElement | SVGElement>(ref: React.RefObject<T>) {
  const app = useApp()
  React.useLayoutEffect(() => {
    autorun(() => {
      const {
        offset,
        camera: {
          point: [cx, cy],
          zoom: cz,
        },
      } = app.viewport
      const elm = ref.current
      if (!elm) return
      elm.style.setProperty(
        'transform',
        `scale(${cz}) 
         translate(${cx + offset[0]}px, ${cy + offset[1]}px)`
      )
    })
  }, [app, ref])
}
