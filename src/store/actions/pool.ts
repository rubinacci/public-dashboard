import axios from 'axios'
import { Dispatch } from 'redux'
import _ from 'lodash'
import log from '../../util/log'
import { DateTime } from 'luxon'
import Big from 'big.js'

export const loadPool = () => async (dispatch:Dispatch, getState:any) => {
  const contractAddress:string = getState().pool.contractAddress
  log.info('store:pool:load', contractAddress)
  dispatch({ type: 'POOL_LOADING' })

  Promise.all([
    // getPrice(contractAddress),
    // getStaSupply(contractAddress),
    // getWStaSupply(contractAddress),
    getChartData(contractAddress),
  ])
    .then(_results => {
      const anyErrors = _.some(_results, (result:any) => result.status === 'error')
      log.info('store:statera:load:complete', _results, 'anyErrors?', anyErrors)

      if (anyErrors) {
        dispatch({ type: 'POOL_ERROR' })
      } else {
        dispatch({ type: 'POOL_SUCCESS', payload: _results })
      }
    })
}


// Chart

const getChartData = (contractAddress:string) => {
  return new Promise(resolve => {
    axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', {
      query: `
        {
          pairDayDatas(
            where: { pairAddress: "${contractAddress}" }
            orderBy:date
            orderDirection:desc
            first:365)
            {
              date
              reserveUSD
              dailyVolumeUSD
            }
        }
      `
    })
      .then(_res => {
        log.info('pool:getChartData:success', _res.data.data)
        let data = _res.data.data.pairDayDatas
        data.reverse()

        let volume:any = []
        let liquidity:any = []
        let feeReturns:any = []

        data.forEach((item:any) => {
          const date = DateTime.fromSeconds(item.date).toISO()
          const parsedVolume = Big(item.dailyVolumeUSD).toNumber()
          const parsedLiquidity = Big(item.reserveUSD).toNumber()
          const parsedFeeReturns = (Math.pow((((parsedVolume * 0.003) / parsedLiquidity) + 1), 365)) -1

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

        const day1ApyItems:any = _.takeRight(feeReturns, 1)
        const day7ApyItems:any = _.takeRight(feeReturns, 7)
        const day30ApyItems:any = _.takeRight(feeReturns, 30)

        resolve({
          name: 'chart',
          status: 'success',
          result: {
            chart: {
              volume,
              liquidity,
              feeReturns,
            },
            apy: {
              day1: day1ApyItems[0][1],
              day7: _.meanBy(day7ApyItems, (item:any) => item[1]),
              day30: _.meanBy(day30ApyItems, (item:any) => item[1]),
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
