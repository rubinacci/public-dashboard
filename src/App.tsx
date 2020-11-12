import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Modal from "react-modal"

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import Sidebar from './Components/Sidebar'
import Dashboard from './Components/Dashboard'
import { useEagerConnect } from './hooks/useEagerConnect'
import { useInactiveListener } from './hooks/useInactiveListener'

Modal.setAppElement('#root')

const getLibrary = (provider: any) => new Web3Provider(provider)

const EagerConnect = () => {
    const triedEager = useEagerConnect()
    useInactiveListener(!triedEager)
    return null
}

const App = () => {  
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <EagerConnect />
            <Router>
                <div className="flex flex-row w-full h-full">
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Switch>
                            <Route exact path="/" component={Dashboard} />
                        </Switch>
                    </div>
                </div>
            </Router>
        </Web3ReactProvider>
    )
}

export default App
