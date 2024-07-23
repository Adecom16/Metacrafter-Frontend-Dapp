import React from 'react'
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
import Header from "./components/Header";
import VestingComponent from './components/Vesting';
import Vest from './components/vest';

// VestingComponent
configureWeb3Modal();


function App() {
  return (
    <div>
      <Header/>
      <Vest/>
      {/* <VestingComponent/> */}
    </div>
  )
}

export default App
