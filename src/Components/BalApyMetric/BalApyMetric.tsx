import React, { useState } from 'react'
import classes from '../ApyMetric/ApyMetric.module.scss'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import SegmentedTabs from '../SegmentedTabs/SegmentedTabs'

const BalApyMetric = (props:any) => {
  const multiPoolState = useSelector((state:any) => state.multiPool)

  const displayedApy = (multiPoolState.data.feesAndBalReturns * 100).toFixed(0)

  let apyDom
  if (multiPoolState.data.feesAndBalReturns >= 0) {
    apyDom = (
      <div className={cx(classes.apyCenter, classes.green)}>
        <span>+{ displayedApy }%</span>
        <span className={classes.textDark}>APY</span>
      </div>
    )
  } else if (multiPoolState.data.feesAndBalReturns < 0) {
    apyDom = (
      <div className={cx(classes.apyCenter, classes.red)}>
        <span>-{ displayedApy }%</span>
        <span className={classes.textDark}>APY</span>
      </div>
    )
  }

  return (
    <div className={classes.container}>
      { apyDom }

      <div className={classes.subtitle}>Fees + BAL Rewards</div>
    </div>
  )
}

export default BalApyMetric
