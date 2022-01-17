import { AppContext } from './components/AppContext'
import { Layout } from './components/Layout'

function App() {
  return (
    <div className="App">
      <AppContext>
        <Layout />
      </AppContext>
    </div>
  )
}

export default App
