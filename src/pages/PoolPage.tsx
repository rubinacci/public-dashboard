import React, { FunctionComponent, useState, useEffect } from 'react'
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
  const params:any = useParams()
  const contractAddress:string = params.contract_address

  const dispatch = useDispatch()

  const poolState = useSelector((state:any) => state.pool)
  const [chartType, setChartType] = useState('volume')
  const [chartTimePeriod, setChartTimePeriod] = useState('7_day')

  useEffect(() => {
    dispatch({ type: 'SET_POOL', payload: { contractAddress } })
    dispatch(loadPool())
  }, [dispatch])

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
    console.log('chartData: ', chartData);

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
