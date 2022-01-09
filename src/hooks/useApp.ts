import * as React from 'react'
import { appContext } from '../components/AppContext'

export function useApp() {
  const { app } = React.useContext(appContext)
  return app
}
