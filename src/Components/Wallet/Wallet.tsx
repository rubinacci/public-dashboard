import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classes from './Wallet.module.scss'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import StaButton from '../StaButton/StaButton'
import { useWeb3React, getWeb3ReactContext } from '@web3-react/core'
import { injected, walletConnect } from '../../web3/connectors'
import { useTokenBalance } from '../../hooks/useTokenBalance'
import { POOLS, ASSETS } from '../../Constants/Constants'
import _ from 'lodash'

const Wallet = (props:any) => {
  const { isStaPage, poolContractAddress } = props

  const web3 = useWeb3React()
  const { activate, deactivate, account, active } = web3

  // TODO: web3 work goes here ;)
  // Resolve the
  let assetContractAddress:any = []
  if (isStaPage) {
    assetContractAddress.push(ASSETS.find(item => item.ticker === 'STA')?.
    contractAddress)
    assetContractAddress.push(ASSETS.find(item => item.ticker === 'wSTA')?.contractAddress)
  } else {
    let currentPool:any
    _.mapValues(POOLS, (value, key) => {
      if (value.contractAddress === poolContractAddress) {
        currentPool = value
      }
    })
    if (currentPool) {
      currentPool.assets.forEach((item:any) => {
        assetContractAddress.push(item.contractAddress)
      })
    }
  }
  console.log('assetContractAddress: ', assetContractAddress);
  // TODO: Retrieve the balances of each of these assets in the users' wallet

  let walletDom
  if (account) {
    walletDom = (
      <div className={classes.section}>
        Connected! { account }
      </div>
    )
  } else {
    walletDom = (
      <div className={classes.section}>
        <StaButton onClick={() => { activate(injected) }}>
          Connect with Metamask
        </StaButton>

        <StaButton onClick={() => { activate(walletConnect, undefined, true) }}>
          Connect with Walletconnect
        </StaButton>
      </div>
    )
  }

  return (
    <div className={classes.container}>
      {/* <div className={classes.gridItem}>
        <div className={classes.title}>My Wallet</div>
      </div>

      <div className={classes.gridItem}>
        <div className={classes.title}>My Liquidity</div>
      </div>

      <div className={classes.gridItem}>
        <div className={classes.title}>Actions</div>
        <StaButton
          to="https://app.uniswap.org/#/add/TOKEN1/TOKEN2"
          target="_blank"
        >
          Add Liquidity
        </StaButton>

        <StaButton
          to="https://app.uniswap.org/#/remove/TOKEN1/TOKEN2"
          target="_blank"
        >
          Remove Liquidity
        </StaButton>
      </div> */}

      { walletDom }
    </div>
  )
}

export default Wallet
