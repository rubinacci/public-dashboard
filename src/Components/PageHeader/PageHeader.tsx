import React from 'react'
import classes from './PageHeader.module.scss'
import cx from "classnames"


const PageHeader = (props:any) => {
  const { title, price, priceChangePerc } = props

  let priceChangeDom
  if (priceChangePerc && priceChangePerc >= 1) {
    priceChangeDom = <div className={cx(classes.priceChange, classes.green)}>{ priceChangePerc }%</div>
  } else if (priceChangePerc && priceChangePerc < 1) {
    priceChangeDom = <div className={cx(classes.priceChange, classes.red)}>{ priceChangePerc }%</div>
  }

  return (
    <div className={classes.container}>
      <div className={classes.title}>{ title }</div>
      <div className={classes.price}>{ price }</div>
      { priceChangeDom }
    </div>
  )
}

export default PageHeader
