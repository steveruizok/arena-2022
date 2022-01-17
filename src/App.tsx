import { GameContext } from '~components/state-tree/GameContext'
import { AppContext } from './components/AppContext'
import { Layout } from './components/Layout'

function App() {
  return (
    <div className="App">
      <GameContext>
        <AppContext>
          <Layout />
        </AppContext>
      </GameContext>
    </div>
  )
}

export default App
