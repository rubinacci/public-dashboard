import axios from 'axios'
import { Dispatch } from 'redux'
import {
  STA_CONTRACT_ADDRESS,
  WSTA_CONTRACT_ADDRESS,
} from '../../Constants/Constants'
import _ from 'lodash'
import log from '../../util/log'
import { DateTime } from 'luxon'

export const load = () => async (dispatch:Dispatch) => {
  log.info('store:statera:load')
  dispatch({ type: 'STATERA_LOADING' })

  Promise.all([
    getStaPriceAndVolume(),
    getWStaPrice(),
    getStaSupply(),
    getWStaSupply(),
    getChartData(),
  ])
    .then(_results => {
      const anyErrors = _.some(_results, (result:any) => result.status === 'error')
      log.info('store:statera:load:complete', _results, 'anyErrors?', anyErrors)

      if (anyErrors) {
        dispatch({ type: 'STATERA_ERROR' })
      } else {
        dispatch({ type: 'STATERA_SUCCESS', payload: _results })
      }
    })
}


// Price & volume

const getStaPriceAndVolume = () => {
  return new Promise(resolve => {
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
        const currentPrice = _res.data.market_data?.current_price?.usd
        const priceChangePerc = _res.data.market_data?.price_change_percentage_24h
        const priceChange = _res.data.market_data?.price_change_24h_in_currency?.usd
        const previousPrice = currentPrice + priceChange

        const tickers = _res.data.tickers
        const tickerData = tickers.find((item:any) => item.market.identifier === 'uniswap')
        const volumeInSta = tickerData.volume
        const volumeInCurrency = tickerData.converted_volume?.usd


        resolve({
          name: 'price:sta',
          status: 'success',
          result: {
            currentPrice,
            priceChangePerc,
            priceChange,
            previousPrice,
            volumeInSta,
            volumeInCurrency,
          },
        })
      })
      .catch(_error => {
        resolve({
          name: 'price:sta',
          status: 'error',
          result: _error
        })
      })
  })
}

const getWStaPrice = () => {
  return new Promise(resolve => {
    axios.get('https://api.coingecko.com/api/v3/coins/wrapped-statera', {
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
        const currentPrice = _res.data.market_data?.current_price?.usd
        const priceChangePerc = _res.data.market_data?.price_change_percentage_24h
        const priceChange = _res.data.market_data?.price_change_24h_in_currency?.usd
        const previousPrice = currentPrice + priceChange

        resolve({
          name: 'price:wsta',
          status: 'success',
          result: {
            currentPrice,
            priceChangePerc,
            priceChange,
            previousPrice,
          },
        })
      })
      .catch(_error => {
        resolve({
          name: 'price:wsta',
          status: 'error',
          result: _error
        })
      })
  })
}


// Supply

const getStaSupply = () => {
  return new Promise(resolve => {
    axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'stats',
        action: 'tokensupply',
        contractaddress: STA_CONTRACT_ADDRESS,
        apikey: process.env.REACT_APP_ETHERSCAN_API_KEY,
      }
    })
      .then(_res => {
        resolve({
          name: 'supply:sta',
          status: 'success',
          result: _res.data.result,
        })
      })
      .catch(_error => {
        resolve({
          name: 'supply:sta',
          status: 'error',
          result: _error
        })
      })
  })
}

const getWStaSupply = () => {
  return new Promise(resolve => {
    axios.get('https://api.etherscan.io/api', {
      params: {
        module: 'stats',
        action: 'tokensupply',
        contractaddress: WSTA_CONTRACT_ADDRESS,
        apikey: process.env.REACT_APP_ETHERSCAN_API_KEY,
      }
    })
      .then(_res => {
        resolve({
          name: 'supply:wsta',
          status: 'success',
          result: _res.data.result,
        })
      })
      .catch(_error => {
        resolve({
          name: 'supply:wsta',
          status: 'error',
          result: _error
        })
      })
  })
}


// Chart

const getChartData = () => {
  return new Promise(resolve => {
    const to = DateTime.local().toSeconds()
    const from = DateTime.local().minus({ days: 30 }).toSeconds()

    axios.get('https://api.coingecko.com/api/v3/coins/statera/market_chart/range', {
      params: {
        vs_currency: 'usd',
        to,
        from,
      }
    })
      .then(_res => {
        const price = _res.data.prices
        const volume = _res.data.total_volumes

        resolve({
          name: 'chart',
          status: 'success',
          result: {
            price,
            volume,
          },
        })
      })
      .catch(_error => {
        resolve({
          name: 'chart',
          status: 'error',
          result: _error
        })
      })
  })
}
