import './App.css';

import {MetamaskButton} from "./Components/MetamaskButton"
import React from 'react';
import {Workspace} from "./Components/Workspace"

function App() {  
  return (
    <div className="App">
      <MetamaskButton/>
      <Workspace/>
    </div>
  );
}

export default App;
