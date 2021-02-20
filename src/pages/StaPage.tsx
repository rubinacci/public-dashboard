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

  const staSupplyString = stateraState.supply.remainingSta ? stateraState.supply.remainingSta.toFixed(0) : 0
  const staSupply = Intl.NumberFormat('en-GB').format(staSupplyString);

  const wStaSupplyString = stateraState.supply.remainingWSta ? stateraState.supply.remainingWSta.toFixed(0) : 0
  const wStaSupply = Intl.NumberFormat('en-GB').format(wStaSupplyString);

  return (
    <div className={classes.container}>
      <div className={classes.dashboardContainer}>
        <PageHeader
          title="Statera (STA)"
          price={Intl.NumberFormat('en-GB', {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
          }).format(stateraState.price.sta.current)}
          priceChangePerc={Intl.NumberFormat('en-GB', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(stateraState.price.sta.changePerc)}
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
                  value: Intl.NumberFormat('en-GB', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(stateraState.volume.inSta),
                  unit: 'STA',
                }, {
                  value: Intl.NumberFormat('en-GB').format(stateraState.volume.inCurrency),
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
