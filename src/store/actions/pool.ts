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


// Price & volume

// const getPrice = (contractAddress:string) => {
//   return new Promise(resolve => {
//     axios.get('https://api.coingecko.com/api/v3/coins/statera', {
//       params: {
//         localization: 'false',
//         tickers: 'true',
//         market_data: 'true',
//         community_data: 'false',
//         developer_data: 'false',
//         sparkline: 'false',
//       }
//     })


//     axios.get('https://api.coingecko.com/api/v3/coins/statera', {
//       params: {
//         localization: 'false',
//         tickers: 'true',
//         market_data: 'true',
//         community_data: 'false',
//         developer_data: 'false',
//         sparkline: 'false',
//       }
//     })
//       .then(_res => {
//         const currentPrice = _res.data.market_data?.current_price?.usd
//         const priceChangePerc = _res.data.market_data?.price_change_percentage_24h
//         const priceChange = _res.data.market_data?.price_change_24h_in_currency?.usd
//         const previousPrice = currentPrice + priceChange

//         const tickers = _res.data.tickers
//         const tickerData = tickers.find((item:any) => item.market.identifier === 'uniswap')
//         const volumeInSta = tickerData.volume
//         const volumeInCurrency = tickerData.converted_volume?.usd


//         resolve({
//           name: 'price',
//           status: 'success',
//           result: {
//             currentPrice,
//             priceChangePerc,
//             priceChange,
//             previousPrice,
//             volumeInSta,
//             volumeInCurrency,
//           },
//         })
//       })
//       .catch(_error => {
//         resolve({
//           name: 'price',
//           status: 'error',
//           result: _error
//         })
//       })
//   })
// }


// Supply

// const getStaSupply = () => {
//   return new Promise(resolve => {
//     axios.get('https://api.etherscan.io/api', {
//       params: {
//         module: 'stats',
//         action: 'tokensupply',
//         contractaddress: STA_CONTRACT_ADDRESS,
//         apikey: process.env.REACT_APP_ETHERSCAN_API_KEY,
//       }
//     })
//       .then(_res => {
//         resolve({
//           name: 'supply:sta',
//           status: 'success',
//           result: _res.data.result,
//         })
//       })
//       .catch(_error => {
//         resolve({
//           name: 'supply:sta',
//           status: 'error',
//           result: _error
//         })
//       })
//   })
// }

// const getWStaSupply = () => {
//   return new Promise(resolve => {
//     axios.get('https://api.etherscan.io/api', {
//       params: {
//         module: 'stats',
//         action: 'tokensupply',
//         contractaddress: WSTA_CONTRACT_ADDRESS,
//         apikey: process.env.REACT_APP_ETHERSCAN_API_KEY,
//       }
//     })
//       .then(_res => {
//         resolve({
//           name: 'supply:wsta',
//           status: 'success',
//           result: _res.data.result,
//         })
//       })
//       .catch(_error => {
//         resolve({
//           name: 'supply:wsta',
//           status: 'error',
//           result: _error
//         })
//       })
//   })
// }


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
        console.log('day1ApyItems: ', day1ApyItems);
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
