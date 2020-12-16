import React, { useContext, useEffect } from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"

import Modal from "react-modal"

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import Sidebar from './Components/Sidebar'
import Dashboard from './Components/Dashboard'
import { useEagerConnect } from './hooks/useEagerConnect'
import { useInactiveListener } from './hooks/useInactiveListener'
import { Pool } from './Constants/Pool'
import PoolView from './Components/PoolView'
import ReactDOM from 'react-dom'

import logo from "./assets/images/pools/statera.png"
import { Context, Store } from './Store'
import { fetchETHPrice } from './hooks/useGlobalState'
import { useApiResult } from './hooks/useApiResult'

Modal.setAppElement('#root')

const getLibrary = (provider: any) => new Web3Provider(provider)

const EagerConnect = () => {
    const triedEager = useEagerConnect()
    useInactiveListener(!triedEager)
    return null
}

const uniswapGraphClient = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"
})

const LoadingScreen = () => {
    document.getElementById("loading")!.className += " loading-container"
    return <>
        <div className="flex flex-row relative">
            <img src={logo} className="w-12 h-12" alt="statera" />
            <span className="font-bold text-gradient text-3xl ml-2">Statera</span>
        </div>
    </>
}

const renderLoading = () => {
    ReactDOM.render(<LoadingScreen />, document.getElementById("loading"))
}

const Loader = () => {
    const { dispatch } = useContext(Context)
    useEffect(() => {
        renderLoading()
        ;(async () => {
            dispatch({ type: "SET_ethPrice", data: await fetchETHPrice() })
        })()
    }, [dispatch])
    return null
}

const StatsDataLoader = () => {
    const data = useApiResult("/stats", {}).data
    const { dispatch } = useContext(Context)
    useEffect(() => { if (data) dispatch({ type: "SET_statsData", data }) }, [data, dispatch])
    return null
}
const ChartDataLoader = () => {
    const data = useApiResult("/chartdata", {}).data
    const { dispatch } = useContext(Context)
    useEffect(() => { if (data) dispatch({ type: "SET_chartData", data }) }, [data, dispatch])
    return null
}

const App = () => { 
    return (
        <ApolloProvider client={uniswapGraphClient}>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Store>
                    <Loader />
                    <StatsDataLoader />
                    <ChartDataLoader />
                    <EagerConnect />
                    <Router>
                        <div className="flex flex-row w-screen h-screen overflow-x-hidden">
                            <Sidebar />
                            <div className="flex flex-col w-full" style={{ minHeight: 720 /* anything smaller looks off */ }}>
                                <Switch>
                                    <Route exact path="/" component={Dashboard} />
                                    <Route exact path="/statera" component={() => <PoolView pool={Pool.STATERA} />} />
                                    <Route exact path="/delta" component={() => <PoolView pool={Pool.DELTA} />} />
                                    <Route exact path="/phoenix" component={() => <PoolView pool={Pool.PHOENIX} />} />
                                </Switch>
                            </div>
                        </div>
                    </Router>
                </Store>
            </Web3ReactProvider>
        </ApolloProvider>
    )
}

export default App
