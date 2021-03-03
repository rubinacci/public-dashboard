import React, { FunctionComponent, useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { loadMultiPool } from '../store/actions/multiPool'
import PageHeader from '../Components/PageHeader/PageHeader'
import classes from './PoolPage.module.scss'
import Metric from '../Components/Metric/Metric'
import _ from 'lodash'
import { genFormattedNumber } from '../util/numberFormat'
import { Chart } from 'react-google-charts'

const MultiPoolPage: FunctionComponent<void> = () => {
  const mounted:any = useRef()

  const params:any = useParams()
  const contractAddress:string = params.contract_address

  const dispatch = useDispatch()

  const multiPoolState = useSelector((state:any) => state.multiPool)

  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
      dispatch({ type: 'SET_MULTI_POOL', payload: { contractAddress } })
      dispatch(loadMultiPool())

      mounted.current = true;
    } else {
      // do componentDidUpdate logic
      if (contractAddress && contractAddress !== multiPoolState.contractAddress) {
        dispatch({ type: 'RESET_MULTI_POOL' })
        dispatch({ type: 'SET_MULTI_POOL', payload: { contractAddress } })
        dispatch(loadMultiPool())
      }
    }
  })


  if (multiPoolState.meta.success) {
    return (
      <div className={classes.container}>
        <div className={classes.dashboardContainer}>
          <PageHeader
            title={multiPoolState.name}
          />

          <div className={classes.dashboard}>

            <div className={classes.dashboardLeft}>
              <div className={classes.threeGrid}>
                <div className={classes.card}>
                  <Metric
                    className={classes.metric}
                    label="Holder Count"
                    valueItems={[{
                      value: multiPoolState.data.liquidityProviderCount,
                    }]}
                  />
                </div>
                <div className={classes.card}>
                  <Metric
                    className={classes.metric}
                    label="Asset Value"
                    valueItems={[{
                      value: genFormattedNumber(multiPoolState.data.assetValue, 2),
                      unit: 'USD',
                    }]}
                  />
                </div>
                <div className={classes.card}>
                  <Metric
                    className={classes.metric}
                    label="Liquidity"
                    valueItems={[{
                      value: genFormattedNumber(multiPoolState.data.liquidity, 2),
                      unit: 'USD',
                    }]}
                  />
                </div>
                <div className={classes.card}>
                  <Metric
                    className={classes.metric}
                    label="24H Volume"
                    valueItems={[{
                      value: genFormattedNumber(multiPoolState.data.volume, 2),
                      unit: 'USD',
                    }]}
                  />
                </div>
                <div className={classes.card}>
                  <Metric
                    className={classes.metric}
                    label="24H Fees Earned"
                    valueItems={[{
                      value: genFormattedNumber(multiPoolState.data.feesEarned, 2),
                      unit: 'USD',
                    }]}
                  />
                </div>
                <div className={classes.card}>
                  <Metric
                    className={classes.metric}
                    label="24H Fees APY"
                    valueItems={[{
                      value: genFormattedNumber(multiPoolState.data.feesApy * 100, 2),
                      unit: '%',
                    }]}
                  />
                </div>
              </div>
            </div>

            <div className={classes.dashboardRight}>
              <div className={classes.card}>
                <div className={classes.cardTitle}>Assets</div>
                <Chart
                  width={'100%'}
                  height={'200px'}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ['Asset', 'Portion'],
                    ...multiPoolState.assets.map((item:any) => ([ item.ticker, item.proportion ])),
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

export default MultiPoolPage
