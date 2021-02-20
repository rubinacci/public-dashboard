import React from 'react'
import classes from './Metric.module.scss'


const Metric = (props:any) => {
  const { label, valueItems, progressPerc, children } = props

  let valueDoms
  let progressDom
  if (!children) {
    valueDoms = valueItems.map((item:any, index:Number) => {
      return (
        <div key={`metric-${index}`} className={classes.value}>
          { item.value } { item.unit }
        </div>
      )
    })

    if (progressPerc) {
      progressDom = (
        <div className={classes.progressContainer}>
          <div
            className={classes.progressBar}
            style={{ width: `${progressPerc * 100}%` }}
          />
        </div>
      )
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.label}>{ label }</div>
      { children }
      { valueDoms }
      { progressDom }
    </div>
  )
}

export default Metric
