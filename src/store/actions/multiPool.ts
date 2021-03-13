import axios from 'axios'
import { Dispatch } from 'redux'
import _ from 'lodash'
import log from '../../util/log'
import { DateTime } from 'luxon'
import Big from 'big.js'
import MultiPoolApi from '../mocks/multiPoolApi.json'

export const loadMultiPool = () => async (dispatch:Dispatch, getState:any) => {
  const contractAddress:string = getState().multiPool.contractAddress
  log.info('store:multiPool:load', contractAddress)
  dispatch({ type: 'MULTI_POOL_LOADING' })

  Promise.all([
    getData(contractAddress),
    getBalancerLiquidity(),
    getBalancerPrice(),
    getChartData(contractAddress),
  ])
    .then(_results => {
      const anyErrors = _.some(_results, (result:any) => result.status === 'error')
      log.info('store:statera:load:complete', _results, 'anyErrors?', anyErrors)

      if (anyErrors) {
        dispatch({ type: 'MULTI_POOL_ERROR' })
      } else {
        dispatch({ type: 'MULTI_POOL_SUCCESS', payload: _results })
      }
    })
}


// General Data

const getData = (contractAddress:string) => {
  return new Promise(resolve => {
    axios.post('https://api.thegraph.com/subgraphs/name/balancer-labs/balancer', {
      query: `
        {
          pool(id: "${contractAddress}") {
            id
            swapFee
            totalShares
            liquidity
            totalSwapVolume
            holdersCount
            swapFee
            swaps (first: 1,orderBy: timestamp,orderDirection: desc, where: {timestamp_lt: ${Math.floor(Date.now() / 1000) - 86400}}) {
              poolTotalSwapVolume
            }
          }
        }
      `
    })
      .then(_res => {
        const data = _res?.data?.data?.pool
        log.info('multiPool:getData:success', _res.data.data)

        const liquidity = Number(data.liquidity)
        const volume = data.totalSwapVolume - data.swaps[0]?.poolTotalSwapVolume
        const assetValue = liquidity / data.totalShares
        const feesEarned = volume * data.swapFee
        const feesApy = (Math.pow(((feesEarned / liquidity) + 1), 365)) -1

        resolve({
          name: 'data',
          status: 'success',
          result: {
            assetValue,
            liquidity,
            volume,
            feesEarned,
            feesApy,
            liquidityProviderCount: Number(data.holdersCount),
          },
        })
      })
      .catch(_error => {
        resolve({
          name: 'data',
          status: 'error',
          result: _error
        })
      })
  })
}


// Balancer Liquidity

const getBalancerLiquidity = () => {
  return new Promise(resolve => {
    axios.post('https://api.thegraph.com/subgraphs/name/balancer-labs/balancer', {
      query: `
        {
          balancers {
            totalLiquidity
          }
        }
      `
    })
      .then(_res => {
        const totalBalancerLiquidity = _res?.data?.data?.balancers[0]?.totalLiquidity
        log.info('multiPool:getBalancerLiquidity:success', totalBalancerLiquidity)

        resolve({
          name: 'balancerLiquidity',
          status: 'success',
          result: {
            totalBalancerLiquidity: Big(totalBalancerLiquidity).toNumber(),
          },
        })
      })
      .catch(_error => {
        resolve({
          name: 'data',
          status: 'error',
          result: _error
        })
      })
  })
}


// Balancer Price

const getBalancerPrice = () => {
  return new Promise(resolve => {
    axios.get('https://api.coingecko.com/api/v3/coins/balancer', {
      params: {
        localization: false,
        market_data: true,
        sparkline: false,
        current_price: true,
        currency: 'usd',
      },
    })
      .then(_res => {
        const balancerPrice = _res?.data?.market_data?.current_price?.usd
        log.info('multiPool:getBalancerPrice:success', balancerPrice)

        resolve({
          name: 'balancerPrice',
          status: 'success',
          result: {
            balancerPrice,
          },
        })
      })
      .catch(_error => {
        resolve({
          name: 'data',
          status: 'error',
          result: _error
        })
      })
  })
}


// Chart

const getChartData = (contractAddress:string) => {
  return new Promise(resolve => {
    const _res:any = MultiPoolApi
    axios.get(`${process.env.REACT_APP_MULTI_POOL_DATA_API}/api/data`)
      .then(_res => {
        log.info('multiPool:getChartData:success', _res.data)
        let data = _res.data.map((item:any) => {
          const matchedPool = item.data.find((item:any) => item.id === contractAddress)
          return {
            date: item.inserted_at,
            volume: matchedPool['24HourVolume'],
            liquidity: matchedPool.liquidity,
            swapFee: matchedPool.swapFee,
            totalShares: matchedPool.totalShares,
            holdersCount: matchedPool.holdersCount,
          }
        })

        let assetPrice:any = []
        let volume:any = []
        let liquidity:any = []
        let feeReturns:any = []

        data.forEach((item:any) => {
          const date = item.date
          const parsedVolume = Big(item.volume).toNumber()
          const parsedLiquidity = Big(item.liquidity).toNumber()
          const parsedFeeReturns = (Math.pow((((parsedVolume * 0.003) / parsedLiquidity) + 1), 365)) - 1
          const parsedTotalShares = Big(item.totalShares).toNumber()
          const parsedAssetPrice = parsedLiquidity / parsedTotalShares

          assetPrice.push([
            date,
            parsedAssetPrice,
          ])

          volume.push([
            date,
            parsedVolume,
          ])

          liquidity.push([
            date,
            parsedLiquidity,
          ])

          feeReturns.push([
            date,
            parsedFeeReturns,
          ])
        })

        resolve({
          name: 'chart',
          status: 'success',
          result: {
            chart: {
              assetPrice,
              volume,
              liquidity,
              feeReturns,
            },
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
