import React from 'react'
import classes from './SegmentedTabs.module.scss'
import cx from 'classnames'

const SegmentedTabs = (props:any) => {
  const { items, value, onInput } = props

  let tabsDom = items.map((item:any, index:number) => {
    return (
      <div
        key={`chart-tab-${index}`}
        className={cx(
          classes.tab,
          {
            [classes.active]: value === item.value,
          }
        )}
        onClick={() => onInput(item.value)}
      >
        { item.text }
      </div>
    )
  })

  return (
    <div className={classes.container}>
      <div className={classes.tabContainer}>
        { tabsDom }
      </div>
    </div>
  )
}

export default SegmentedTabs
