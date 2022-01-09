import { autorun } from 'mobx'
import React from 'react'
import { useApp } from './useApp'

export function useCameraCss<T extends HTMLElement | SVGElement>(ref: React.RefObject<T>) {
  const app = useApp()
  React.useLayoutEffect(() => {
    autorun(() => {
      const {
        zoom,
        point: [x, y],
      } = app.viewport.camera
      const elm = ref.current
      if (!elm) return
      elm.style.setProperty('transform', `scale(${zoom}) translate(${x}px, ${y}px)`)
    })
  }, [ref])
}
