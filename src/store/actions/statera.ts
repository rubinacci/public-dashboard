import axios from 'axios'
import { Dispatch } from 'redux'

export const getCoingeckoMarketData = () => async (dispatch:Dispatch) => {
  dispatch({ type: 'PRICE_LOADING' })

	axios.get('https://api.coingecko.com/api/v3/coins/statera', {
    params: {
      localization: 'false',
      tickers: 'true',
      market_data: 'true',
      community_data: 'false',
      developer_data: 'false',
      sparkline: 'false',
    }
	})
    .then(_res => {
      dispatch({ type: 'PRICE_SUCCESS', payload: _res.data })
    })
    .catch(_error => {
      dispatch({ type: 'PRICE_ERROR', _error })
    })
}
