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
import StaPage from './pages/StaPage'
import PoolPage from './pages/PoolPage'
import MultiPoolPage from './pages/MultiPoolPage'
import Wallet from './Components/Wallet/Wallet'
import Loader from './Components/Loader/Loader'
import { useWeb3React, getWeb3ReactContext } from '@web3-react/core'


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

const renderLoading = () => {
  ReactDOM.render(<Loader />, document.getElementById("loading"))
}

// const Loader = () => {
//     const { dispatch } = useContext(Context)
//     useEffect(() => {
//         renderLoading()
//         ;(async () => {
//             dispatch({ type: "SET_ethPrice", data: await fetchETHPrice() })
//         })()
//     }, [dispatch])
//     return null
// }

// const StatsDataLoader = () => {
//     const data = useApiResult("/stats", {}).data
//     const { dispatch } = useContext(Context)
//     useEffect(() => { if (data) dispatch({ type: "SET_statsData", data }) }, [data, dispatch])
//     return null
// }
// const ChartDataLoader = () => {
//     const data = useApiResult("/chartdata", {}).data as any
//     const { dispatch } = useContext(Context)
//     useEffect(() => {
//         if (data) {
//             if (data["volumes"]) {
//                 const allVolumes: { [timestamp: number]: number } = {}
//                 Object.keys(data["volumes"] || {}).forEach(pool => {
//                     const poolVolumes = data["volumes"][pool]["all"] || []
//                     poolVolumes.forEach(([timestamp, value]: [number, number], i: number) => {
//                         allVolumes[timestamp] = (allVolumes[timestamp] || 0) + value
//                     })
//                 })
//                 data["volumes"]["all"] = { all: Object.keys(allVolumes).map(timestamp => [timestamp, allVolumes[parseInt(timestamp)]]) }
//             }
//             dispatch({ type: "SET_chartData", data })
//         }
//     }, [data, dispatch])
//     return null
// }

const genPageDom = () => {
  return
}

const App = () => {
  const { activate, deactivate, account, active } = useWeb3React()

  return (
    <ApolloProvider client={uniswapGraphClient}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Store>
          <EagerConnect />
          <Router>
            <div className={classes.app}>
              <div className={classes.sidebarContainer}>
                <Sidebar />
              </div>
              <Switch>
                <Route exact path="/" component={IndexPage} />

                <Route path="/sta" render={(props:any) => (
                  <div className={classes.main}>
                    <StaPage />
                    <div className={classes.walletContainer}>
                      <Wallet
                        isStaPage={true}
                      />
                    </div>
                  </div>
                )} />

                <Route path="/pool/:contract_address" render={(props:any) => (
                  <div className={classes.main}>
                    <PoolPage />
                    <div className={classes.walletContainer}>
                      <Wallet
                        isStaPage={false}
                        poolContractAddress={props.match.params.contract_address}
                      />
                    </div>
                  </div>
                )} />

                <Route path="/multi_pool/:contract_address" render={(props:any) => (
                  <div className={classes.main}>
                    <MultiPoolPage />
                    <div className={classes.walletContainer}>
                      <Wallet
                        isStaPage={false}
                        poolContractAddress={props.match.params.contract_address}
                      />
                    </div>
                  </div>
                )} />
              </Switch>
            </div>
          </Router>
        </Store>
      </Web3ReactProvider>
    </ApolloProvider>
  )
}

export default App
