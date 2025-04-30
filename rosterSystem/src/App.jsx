import React from 'react'
import Navbar from './components/Navbar'
import RosterForm from './pages/RosterForm/RosterForm'
import CardGenerator from './pages/CardGenerator/CardGenerator'

function App() {
  return (
    <>
      <Navbar/>
      {/* <RosterForm/> */}
      <CardGenerator/>
    </>
  )
}

export default App