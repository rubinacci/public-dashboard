import React, { useState } from 'react'
import classes from './ApyMetric.module.scss'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import SegmentedTabs from '../SegmentedTabs/SegmentedTabs'

const ApyMetric = (props:any) => {
  const poolState = useSelector((state:any) => state.pool)

  const [chartTimePeriod, setChartTimePeriod] = useState('7_day')

  const handleChartTimePeriodTab = (value:string) => {
    setChartTimePeriod(value)
  }

  let apy
  switch (chartTimePeriod) {
    case '1_day': {
      apy = poolState.data.apy?.day1
      break;
    }
    case '7_day': {
      apy = poolState.data.apy?.day7
      break;
    }
    case '30_day': {
      apy = poolState.data.apy?.day30
      break;
    }
  }

  const displayedApy = (apy * 100).toFixed(0)

  let apyDom
  if (apy >= 0) {
    apyDom = (
      <div className={cx(classes.apy, classes.green)}>
        <span>+{ displayedApy }%</span>
        <span className={classes.textDark}>APY</span>
      </div>
    )
  } else if (apy < 0) {
    apyDom = (
      <div className={cx(classes.apy, classes.red)}>
        <span>-{ displayedApy }%</span>
        <span className={classes.textDark}>APY</span>
      </div>
    )
  }

  return (
    <div className={classes.container}>
      { apyDom }

      <SegmentedTabs
        items={[{
          text: '1D',
          value: '1_day',
        }, {
          text: '7D',
          value: '7_day',
        }, {
          text: '30D',
          value: '30_day',
        }]}
        value={chartTimePeriod}
        onInput={handleChartTimePeriodTab}
      />
    </div>
  )
}

export default ApyMetric
