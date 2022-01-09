import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useApp } from '~hooks/useApp'

export const Controls = observer(function Controls() {
  const app = useApp()
  return (
    <div className="controls">
      <div>
        <code>
          Screen Point: [{app.inputs.currentScreenPoint.map((p) => Math.floor(p)).join(', ')}]
        </code>
      </div>
      <div>
        <code>World Point: [{app.inputs.currentPoint.map((p) => Math.floor(p)).join(', ')}]</code>
      </div>
      <div>
        <code>Iso Point: [{app.inputs.currentIsoPoint.map((p) => Math.floor(p)).join(', ')}]</code>
      </div>
    </div>
  )
})
