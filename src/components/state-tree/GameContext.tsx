import React from 'react'
import { Game } from '~state-tree-engine/Game'

export const gameContext = React.createContext({} as Game)

export function GameContext({ children }: { children: React.ReactNode }) {
  const [game] = React.useState(() => new Game())
  return <gameContext.Provider value={game}>{children}</gameContext.Provider>
}
