import React, { useContext, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import Modal from "react-modal"
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useEagerConnect } from './hooks/useEagerConnect'
import { useInactiveListener } from './hooks/useInactiveListener'
import { Pool } from './Constants/Pool'
import ReactDOM from 'react-dom'
import { Context, Store } from './Store'
import { fetchETHPrice } from './hooks/useGlobalState'
import { useApiResult } from './hooks/useApiResult'
import classes from "./App.module.scss"
import logo from "./assets/images/pools/statera.png"
// Components
import Sidebar from './Components/Sidebar/Sidebar'
// import Dashboard from './Components/Dashboard'
// import PoolView from './Components/PoolView'
import IndexPage from './pages/IndexPage'
import TokenPage from './pages/TokenPage'


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
    const data = useApiResult("/chartdata", {}).data as any
    const { dispatch } = useContext(Context)
    useEffect(() => {
        if (data) {
            if (data["volumes"]) {
                const allVolumes: { [timestamp: number]: number } = {}
                Object.keys(data["volumes"] || {}).forEach(pool => {
                    const poolVolumes = data["volumes"][pool]["all"] || []
                    poolVolumes.forEach(([timestamp, value]: [number, number], i: number) => {
                        allVolumes[timestamp] = (allVolumes[timestamp] || 0) + value
                    })
                })
                data["volumes"]["all"] = { all: Object.keys(allVolumes).map(timestamp => [timestamp, allVolumes[parseInt(timestamp)]]) }
            }
            dispatch({ type: "SET_chartData", data })
        }
    }, [data, dispatch])
    return null
}

const App = () => {
    return (
        <ApolloProvider client={uniswapGraphClient}>
            <Web3ReactProvider getLibrary={getLibrary}>
                <Store>
                    <StatsDataLoader />
                    <ChartDataLoader />
                    <EagerConnect />
                    <Router>
                        <div className={classes.app}>
                            <div className={classes.sidebarContainer}>
                                <Sidebar />
                            </div>
                            <div className={classes.main}>
                                <Switch>
                                    <Route exact path="/" component={IndexPage} />
                                    <Route exact path="/token" component={TokenPage} />
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
