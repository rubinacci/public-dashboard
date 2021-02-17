import React from 'react'
import classes from './Metric.module.scss'


const Metric = (props:any) => {
  const { label, valueItems, valueRatio } = props

  let valueDoms = valueItems.map((item:any, index:Number) => {
    return (
      <div key={`metric-${index}`} className={classes.value}>
        { item.value } { item.unit }
      </div>
    )
  })

  return (
    <div className={classes.container}>
      <div className={classes.label}>{ label }</div>
      { valueDoms }
    </div>
  )
}

export default Metric
