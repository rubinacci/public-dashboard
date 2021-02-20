import React, { FunctionComponent, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { load } from '../store/actions/statera'
import PageHeader from '../Components/PageHeader/PageHeader'
import classes from './StaPage.module.scss'
import cx from 'classnames'
import Metric from '../Components/Metric/Metric'

const genFormattedNumber = (number:any, dp?:number) => {
  const options = dp ? {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  } : undefined

  return Intl.NumberFormat('en-GB', options).format(number)
}

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


  // Supply calcs

  let staSupply
  let staSupplyProgress
  let wStaSupply
  let wStaSupplyProgress
  let staExchangeRate
  let wStaExchangeRate
  if (
    stateraState.supply.remainingSta &&
    stateraState.supply.remainingWSta &&
    stateraState.exchangeRate.staToWSta &&
    stateraState.exchangeRate.wStaToSta
  ) {
    staSupply = genFormattedNumber(stateraState.supply.remainingSta.toFixed(0));
    wStaSupply = genFormattedNumber(stateraState.supply.remainingWSta.toFixed(0));

    staSupplyProgress = stateraState.supply.remainingSta.div(stateraState.supply.total)
    wStaSupplyProgress = stateraState.supply.remainingWSta.div(stateraState.supply.remainingSta)

    staExchangeRate = stateraState.exchangeRate.staToWSta
    wStaExchangeRate = stateraState.exchangeRate.wStaToSta
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
                progressPerc={staSupplyProgress}
              />

              <Metric
                classname={classes.metric}
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
                classname={classes.metric}
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
              { `1 STA = ${genFormattedNumber(staExchangeRate, 2) } WSTA` }
              <br />
              { `1 WSTA = ${genFormattedNumber(wStaExchangeRate, 2) } STA` }
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
