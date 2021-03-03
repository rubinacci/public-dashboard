import React, { useState } from 'react'
import classes from './Wallet.module.scss'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import StaButton from '../StaButton/StaButton'

const Wallet = (props:any) => {

  return (
    <div className={classes.container}>
      Wallet
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
    </div>
  )
}

export default Wallet
