import React from 'react'
import classes from './StaButton.module.scss'

const StaButton = (props:any) => {
  const { onClick, to, target, children } = props

  if (to) {
    return (
      <a href={to} target={target} className={classes.container}>
        { children }
      </a>
    )
  } else {
    return (
      <div onClick={onClick} className={classes.container}>
        { children }
      </div>
    )
  }
}

export default StaButton
