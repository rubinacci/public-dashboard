import React from 'react'
import classes from './TokenIcon.module.scss'


const TokenIcon = (props:any) => {
  const { token } = props

  let iconSrc
  switch (token) {
    case 'STA': {
      iconSrc = 'images/tokenIcons/sta.svg'
      break
    }

    case 'WSTA': {
      iconSrc = 'images/tokenIcons/wsta.png'
      break
    }
  }

  return (
    <div className={classes.container}>
      <img
        className={classes.icon}
        src={iconSrc}
      />
    </div>
  )
}

export default TokenIcon
