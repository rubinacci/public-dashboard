import React from 'react'
import classes from './TokenIcon.module.scss'


const TokenIcon = (props:any) => {
  const { token } = props

  let iconSrc:any
  switch (token) {
    case 'STA': {
      iconSrc = '/images/tokenIcons/sta.svg'
      break
    }

    case 'WSTA': {
      iconSrc = '/images/tokenIcons/wsta.png'
      break
    }
  }

  return (
    <div className={classes.container}>
      <div
        className={classes.icon}
        style={{
          backgroundImage: `url(${iconSrc})`
        }}
      />
    </div>
  )
}

export default TokenIcon
