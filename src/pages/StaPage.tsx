import React, { FunctionComponent, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { load } from '../store/actions/statera'
import PageHeader from '../Components/PageHeader/PageHeader'
import classes from './StaPage.module.scss'
import cx from 'classnames'
import Metric from '../Components/Metric/Metric'
import TokenIcon from '../Components/TokenIcon/TokenIcon'
import { Chart } from 'react-google-charts'
import _ from 'lodash'
import SegmentedTabs from '../Components/SegmentedTabs/SegmentedTabs'

const genFormattedNumber = (number:any, dp?:number) => {
  const options = dp ? {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  } : undefined

  return Intl.NumberFormat('en-GB', options).format(number)
}

const StaPage: FunctionComponent<void> = () => {
  const dispatch = useDispatch()
  const [currentTab, setCurrentTab] = useState('price')

  useEffect(() => {
    dispatch(load())
  }, [dispatch])

  const handleChartTabInput = (value:any) => {
    setCurrentTab(value)
  }

  const stateraState = useSelector((state:any) => state.statera)

  let priceDom
  if (stateraState.meta.loading) {
    priceDom = <div>Loading</div>
  } else if (stateraState.meta.success) {
    priceDom = (
      <div>
        Current Price: { stateraState.price.current }
        <br />
        Previous Price: { stateraState.price.previous }
      </div>
    )
  }


  // Supply calcs

  let staSupply
  let staSupplyProgress
  let wStaSupply
  let wStaSupplyProgress
  let staExchangeRate
  let wStaExchangeRate
  let priceChartData
  let chartDom
  if (stateraState.meta.success) {
    staSupply = genFormattedNumber(stateraState.supply.remainingSta.toFixed(0));
    wStaSupply = genFormattedNumber(stateraState.supply.remainingWSta.toFixed(0));

    staSupplyProgress = stateraState.supply.remainingSta.div(stateraState.supply.total)
    wStaSupplyProgress = stateraState.supply.remainingWSta.div(stateraState.supply.remainingSta)

    staExchangeRate = stateraState.exchangeRate.staToWSta
    wStaExchangeRate = stateraState.exchangeRate.wStaToSta

    if (currentTab === 'price') {
      chartDom = (
        <Chart
          width={'500px'}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={[
            ['Datetime', 'Price'],
            ...stateraState.chart.price,
          ]}
          options={{
            hAxis: {
              title: 'Datetime',
            },
            vAxis: {
              title: 'Price',
            },
          }}
          rootProps={{ 'data-testid': '1' }}
        />
      )
    } else if (currentTab === 'volume') {
      chartDom = (
        <Chart
          width={'500px'}
          height={'400px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={[
            ['Datetime', 'Volume'],
            ...stateraState.chart.volume,
          ]}
          options={{
            hAxis: {
              title: 'Datetime',
            },
            vAxis: {
              title: 'Volume',
            },
          }}
          rootProps={{ 'data-testid': '1' }}
        />
      )
    }
  }

  if (stateraState.meta.success) {
    return (
      <div className={classes.container}>
        <div className={classes.dashboardContainer}>
          <PageHeader
            title="Statera (STA)"
            price={genFormattedNumber(stateraState.price.sta.current, 4)}
            priceChangePerc={genFormattedNumber(stateraState.price.sta.changePerc, 2)}
          />

          <div className={classes.dashboard}>
            <div className={classes.dashboardLeft}>
              <div className={cx(classes.chart, classes.card)}>
                { chartDom }
                <SegmentedTabs
                  items={[{
                    text: 'Price',
                    value: 'price',
                  }, {
                    text: 'Volume',
                    value: 'volume',
                  }]}
                  value={currentTab}
                  onInput={handleChartTabInput}
                />
              </div>
            </div>

            <div className={classes.dashboardRight}>
              <div className={cx(classes.supply, classes.card)}>
                <Metric
                  className={classes.metric}
                  label="Remaining Supply"
                  valueItems={[{
                    value: staSupply,
                    unit: 'STA',
                  }]}
                  progressPerc={staSupplyProgress}
                />

                <Metric
                  className={classes.metric}
                  label="Supply Wrapped"
                  valueItems={[{
                    value: wStaSupply,
                    unit: 'wSTA',
                  }]}
                  progressPerc={wStaSupplyProgress}
                />
              </div>

              <div className={cx(classes.volume, classes.card)}>
                <Metric
                  className={classes.metric}
                  label="Volume (24h)"
                  valueItems={[{
                    value: genFormattedNumber(stateraState.volume.inSta, 0),
                    unit: 'STA',
                  }, {
                    value: genFormattedNumber(stateraState.volume.inCurrency),
                    unit: 'USD',
                  }]}
                />
              </div>

              <div className={cx(classes.exchangeRate, classes.card)}>
                <Metric
                  className={classes.metric}
                  label="Exchange Rate"
                >
                  <div className={classes.exchangeRateRow}>
                    <div className={classes.exchangeRateRowIcon}>
                      <TokenIcon token="STA" />
                    </div>
                    <div className={classes.exchangeRateRowText}>
                      { `1 STA = ${genFormattedNumber(staExchangeRate, 2) } WSTA` }
                    </div>
                  </div>

                  <div className={classes.exchangeRateRow}>
                    <div className={classes.exchangeRateRowIcon}>
                      <TokenIcon token="WSTA" />
                    </div>
                    <div className={classes.exchangeRateRowText}>
                      { `1 WSTA = ${genFormattedNumber(wStaExchangeRate, 2) } STA` }
                    </div>
                  </div>
                </Metric>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.wallet}>

        </div>
      </div>
    )
  } else {
    return <div>Loading</div>
  }
}

export default StaPage
