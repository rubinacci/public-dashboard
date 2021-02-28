import React, { FunctionComponent, useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { loadPool } from '../store/actions/pool'
import PageHeader from '../Components/PageHeader/PageHeader'
import classes from './StaPage.module.scss'
import cx from 'classnames'
import Metric from '../Components/Metric/Metric'
import TokenIcon from '../Components/TokenIcon/TokenIcon'
import { Chart } from 'react-google-charts'
import _ from 'lodash'
import SegmentedTabs from '../Components/SegmentedTabs/SegmentedTabs'
import { genFormattedNumber } from '../util/numberFormat'

const PoolPage: FunctionComponent<void> = () => {
  const mounted:any = useRef()

  const params:any = useParams()
  const contractAddress:string = params.contract_address
  console.log('contractAddress: ', contractAddress);

  const dispatch = useDispatch()

  const poolState = useSelector((state:any) => state.pool)
  const [chartType, setChartType] = useState('volume')
  const [chartTimePeriod, setChartTimePeriod] = useState('7_day')

  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
      dispatch({ type: 'SET_POOL', payload: { contractAddress } })
      dispatch(loadPool())

      mounted.current = true;
    } else {
      // do componentDidUpdate logic
      if (contractAddress && contractAddress !== poolState.contractAddress) {
        dispatch({ type: 'RESET_POOL' })
        dispatch({ type: 'SET_POOL', payload: { contractAddress } })
        dispatch(loadPool())
      }
    }
  })

  const handleChartTypeTab = (value:string) => {
    setChartType(value)
  }

  const handleChartTimePeriodTab = (value:string) => {
    setChartTimePeriod(value)
  }


  if (poolState.meta.success) {
    // Transform chart data by period
    let timePeriod
    switch (chartTimePeriod) {
      case "7_day": {
        timePeriod = 7
        break;
      }

      case "30_day": {
        timePeriod = 30
        break;
      }

      case "365_day": {
        timePeriod = 365
        break;
      }
    }

    let chartData
    if (chartType === 'volume') {
      chartData = [
        ['Datetime', 'Volume'],
        ..._.takeRight(poolState.data.chart.volume.map((item:any) => ([
          item[0],
          item[1].toNumber(),
        ])), timePeriod),
      ]
    } else if (chartType === 'liquidity') {
      chartData = [
        ['Datetime', 'Liquidity'],
        ..._.takeRight(poolState.data.chart.liquidity.map((item:any) => ([
          item[0],
          item[1].toNumber(),
        ])), timePeriod),
      ]
    } else if (chartType === 'feeReturns') {
      chartData = [
        ['Datetime', 'Fee Returns'],
        ..._.takeRight(poolState.data.chart.feeReturns.map((item:any) => ([
          item[0],
          item[1].toNumber(),
        ])), timePeriod),
      ]
    }

    return (
      <div className={classes.container}>
        <div className={classes.dashboardContainer}>
          <PageHeader
            title={poolState.name}
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
                  <div
                    className={classes.typeTabContainer}
                    style={{
                      width: '300px'
                    }}
                  >
                    <SegmentedTabs
                      items={[{
                        text: 'Volume',
                        value: 'volume',
                      },{
                        text: 'Liquidity',
                        value: 'liquidity',
                      },{
                        text: 'Fee Returns',
                        value: 'feeReturns',
                      }]}
                      value={chartType}
                      onInput={handleChartTypeTab}
                    />
                  </div>

                  <div className={classes.timePeriodTabContainer}>
                    <SegmentedTabs
                      items={[{
                        text: '7D',
                        value: '7_day',
                      }, {
                        text: '30D',
                        value: '30_day',
                      }, {
                        text: '1Y',
                        value: '365_day',
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
                <div className={classes.cardTitle}>Assets</div>
                <Chart
                  width={'100%'}
                  height={'200px'}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ['Asset', 'Portion'],
                    ...poolState.assets.map((item:any) => ([ item.ticker, item.proportion ])),
                  ]}
                  options={{
                    chartArea: {
                      left: 0,
                      top: 10,
                      width: '100%',
                      height: '90%',
                    },
                    legend: 'none',
                    pieSliceText: 'label',
                  }}
                />
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

export default PoolPage
