import React from 'react'
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
import Header from "./components/Header";
configureWeb3Modal();


function App() {
  return (
    <div>
      <Header/>
    </div>
  )
}

export default App
