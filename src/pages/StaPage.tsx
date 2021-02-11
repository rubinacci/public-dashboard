import React, { FunctionComponent, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCoingeckoMarketData } from '../store/actions/statera'

const TokenPage: FunctionComponent<void> = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCoingeckoMarketData())
  }, [])


  const priceState = useSelector((state:any) => state.statera.price)

  let priceDom
  if (priceState.meta.loading) {
    priceDom = <div>Loading</div>
  } else if (priceState.meta.success) {
    priceDom = (
      <div>
        Current Price: { priceState.current }
        <br />
        Previous Price: { priceState.previous }
      </div>
    )
  }

  return (
    <div className='xxx'>
      This is the Statera page
      { priceDom }
    </div>
  )
}

export default TokenPage
