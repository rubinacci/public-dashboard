import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import Modal from "react-modal"
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useEagerConnect } from './hooks/useEagerConnect'
import { useInactiveListener } from './hooks/useInactiveListener'
import ReactDOM from 'react-dom'
import { Store } from './Store'
import classes from './App.module.scss'
import cx from 'classnames'
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
import { useWeb3React } from '@web3-react/core'


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

const App = () => {
  const { activate, deactivate, account, active } = useWeb3React()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <ApolloProvider client={uniswapGraphClient}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Store>
          <EagerConnect />
          <Router>
            <div className={classes.app}>
              <div
                className={classes.menuIcon}
                onClick={() => setMenuOpen(!menuOpen)}
              />
              <div className={cx(
                classes.sidebarContainer,
                {
                  [classes.open]: menuOpen,
                }
              )} >
                <Sidebar />
              </div>
              <div
                onClick={() => setMenuOpen(!menuOpen)}
                className={cx(
                  classes.sidebarShade,
                  {
                    [classes.open]: menuOpen,
                  }
                )
              } />
              <Switch>
                <Route exact path="/">
                  <Redirect to="/sta" />
                </Route>

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
