import React from 'react'
import { App } from '../lib'

export const appContext = React.createContext({} as { app: App })

export function AppContext({ children }: { children: React.ReactNode }) {
  const [app] = React.useState(() => new App())
  return <appContext.Provider value={{ app }}>{children}</appContext.Provider>
}
