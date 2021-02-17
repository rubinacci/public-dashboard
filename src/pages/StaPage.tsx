import React, { FunctionComponent, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { load } from '../store/actions/statera'
import PageHeader from '../Components/PageHeader/PageHeader'
import classes from './StaPage.module.scss'
import cx from 'classnames'
import Metric from '../Components/Metric/Metric'
import { JSBI } from "@uniswap/sdk"

const TokenPage: FunctionComponent<void> = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(load())
  }, [dispatch])


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

  const staSupply = stateraState.supply.total - stateraState.supply.current
  console.log('staSupply: ', staSupply);
  const wStaSupply = stateraState.supply.total - stateraState.supply.wsta

  return (
    <div className={classes.container}>
      <div className={classes.dashboardContainer}>
        <PageHeader
          title="Statera (STA)"
          price={stateraState.price.sta.current}
          priceChangePerc={stateraState.price.sta.changePerc}
        />

        <div className={classes.dashboard}>
          <div className={classes.dashboardLeft}>
            <div className={cx(classes.chart, classes.card)} />
          </div>

          <div className={classes.dashboardRight}>
            <div className={cx(classes.supply, classes.card)}>
              <Metric
                classname={classes.metric}
                label="Remaining Supply"
                valueItems={[{
                  value: staSupply,
                  unit: 'STA',
                }]}
              />

              <Metric
                classname={classes.metric}
                label="Supply Wrapped"
                valueItems={[{
                  value: wStaSupply,
                  unit: 'wSTA',
                }]}
              />
            </div>

            <div className={cx(classes.volume, classes.card)}>
              <Metric
                classname={classes.metric}
                label="Volume (24h)"
                valueItems={[{
                  value: stateraState.volume.inSta,
                  unit: 'STA',
                }, {
                  value: stateraState.volume.inCurrency,
                  unit: 'USD',
                }]}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.wallet}>

      </div>
    </div>
  )
}

export default TokenPage
