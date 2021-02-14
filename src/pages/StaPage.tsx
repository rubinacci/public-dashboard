import React, { FunctionComponent, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { load } from '../store/actions/statera'

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

  return (
    <div className='xxx'>
      This is the Statera page
      { priceDom }
    </div>
  )
}

export default TokenPage
