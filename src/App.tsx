import './App.css'
import ConnectionList from './ConnectionList'
import Navigation from './Navigation'
import fakeData from './placeholderdata.json'

function App() {
  if (localStorage.getItem('connections') === null) {
    localStorage.setItem('connections', JSON.stringify(fakeData))
  }

  return (
    <>
      <Navigation/>
      {/* <h1>s</h1> */}
      <main>
        <ConnectionList/>
        {/* ConnectionDetail */}
      </main>
    </>
  )
}

export default App
