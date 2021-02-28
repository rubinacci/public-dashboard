import React, { FunctionComponent, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { load } from '../store/actions/statera'
import PageHeader from '../Components/PageHeader/PageHeader'
import classes from './PoolPage.module.scss'
import cx from 'classnames'
import Metric from '../Components/Metric/Metric'
import TokenIcon from '../Components/TokenIcon/TokenIcon'
import { Chart } from 'react-google-charts'
import _ from 'lodash'
import SegmentedTabs from '../Components/SegmentedTabs/SegmentedTabs'
import { genFormattedNumber } from '../util/numberFormat'


const StaPage: FunctionComponent<void> = () => {
  const dispatch = useDispatch()
  const [chartType, setChartType] = useState('price')
  const [chartTimePeriod, setChartTimePeriod] = useState('1_day')

  useEffect(() => {
    dispatch(load())
  }, [dispatch])

  const handleChartTypeTab = (value:string) => {
    setChartType(value)
  }

  const handleChartTimePeriodTab = (value:string) => {
    setChartTimePeriod(value)
  }

  const stateraState = useSelector((state:any) => state.statera)

  if (stateraState.meta.success) {
    const staSupply = genFormattedNumber(stateraState.supply.remainingSta.toFixed(0));
    const wStaSupply = genFormattedNumber(stateraState.supply.remainingWSta.toFixed(0));

    const staSupplyProgress = stateraState.supply.remainingSta.div(stateraState.supply.total)
    const wStaSupplyProgress = stateraState.supply.remainingWSta.div(stateraState.supply.remainingSta)

    const staExchangeRate = stateraState.exchangeRate.staToWSta
    const wStaExchangeRate = stateraState.exchangeRate.wStaToSta

    // Transform chart data by period
    let chartPriceData
    let chartVolumeData
    switch (chartTimePeriod) {
      case "1_day": {
        chartPriceData = _.takeRight(stateraState.chart.price, 24)
        chartVolumeData = _.takeRight(stateraState.chart.volume, 24)
        break;
      }

      case "7_day": {
        chartPriceData = _.takeRight(stateraState.chart.price, 168)
        chartVolumeData = _.takeRight(stateraState.chart.volume, 168)
        break;
      }

      case "30_day": {
        chartPriceData = stateraState.chart.price
        chartVolumeData = stateraState.chart.volume
        break;
      }
    }

    let chartData
    if (chartType === 'price') {
      chartData = [
        ['Datetime', 'Price'],
        ...chartPriceData,
      ]
    } else if (chartType === 'volume') {
      chartData = [
        ['Datetime', 'Volume'],
        ...chartVolumeData,
      ]
    }


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
              <div className={cx(classes.chartCard, classes.card)}>
                <div className={classes.chartContainer}>
                  <Chart
                    width={'100%'}
                    height={'400px'}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={chartData}
                    options={{
                      legend: 'none',
                      chartArea: {
                        left: 40,
                        top: 20,
                        width: '90%',
                        height: '90%',
                      },
                      hAxis: {
                        textPosition: 'none',
                        gridlines: {
                          color: 'transparent'
                        },
                        textStyle: {
                          fontName: 'Inter',
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#595e78',
                        },
                      },
                      vAxis: {
                        format: 'currency',
                        gridlines: {
                          color: '#e6e6f0'
                        },
                        minorGridlines: {
                          color: 'transparent'
                        },
                        textStyle: {
                          fontName: 'Inter',
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#595e78',
                        },
                      },
                    }}
                  />
                </div>

                <div className={classes.chartActions}>
                  <div className={classes.typeTabContainer}>
                    <SegmentedTabs
                      items={[{
                        text: 'Price',
                        value: 'price',
                      }, {
                        text: 'Volume',
                        value: 'volume',
                      }]}
                      value={chartType}
                      onInput={handleChartTypeTab}
                    />
                  </div>

                  <div className={classes.timePeriodTabContainer}>
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
                </div>
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
