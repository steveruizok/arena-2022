import * as React from 'react'
import { gameContext } from '~components/state-tree/GameContext'

export function useGame() {
  return React.useContext(gameContext)
}
