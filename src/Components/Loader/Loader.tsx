import React from 'react'
import classes from './Loader.module.scss'
import cx from 'classnames'

const Loader = (props:any) => {
  const { size } = props

  return (
    <div className={cx(
      classes.container,
      size === 'small' ? classes.small : null,
      size === 'medium' ? classes.medium : null,
      size === 'large' ? classes.large : null,
    )}>
      <div className={classes.loader}>
        <div className={classes.dot} />
        <div className={classes.dot} />
        <div className={classes.dot} />
        <div className={classes.dot} />
        <div className={classes.dot} />
        <div className={classes.dot} />
      </div>
    </div>
  )
}

export default Loader
