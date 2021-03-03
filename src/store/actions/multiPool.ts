import axios from 'axios'
import { Dispatch } from 'redux'
import _ from 'lodash'
import log from '../../util/log'
import { DateTime } from 'luxon'
import Big from 'big.js'

export const loadMultiPool = () => async (dispatch:Dispatch, getState:any) => {
  const contractAddress:string = getState().multiPool.contractAddress
  log.info('store:multiPool:load', contractAddress)
  dispatch({ type: 'MULTI_POOL_LOADING' })

  Promise.all([
    getData(contractAddress),
    // Leaving space here for future chart data calls
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


// Chart

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
