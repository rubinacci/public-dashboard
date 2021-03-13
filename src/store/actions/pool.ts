import axios from 'axios'
import { Dispatch } from 'redux'
import _ from 'lodash'
import log from '../../util/log'
import { DateTime } from 'luxon'
import Big from 'big.js'
import { resolvePoolFromContractAddress } from '../../util/resolvePool'

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
    const from = DateTime.local().minus({ days: 365 }).toSeconds()
    const to = DateTime.local().toSeconds()
    const pool:any = resolvePoolFromContractAddress(contractAddress)
    console.log('pool: ', pool);

    Promise.all([
      axios.post('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', {
        query: `
          {
            pairDayDatas (
              where:{pairAddress: "0xa94700c1a1ae21324e78d5bdf6b2924e45a6068f"}
              orderBy:date
              orderDirection:desc
              first:365
            ) {
              date
              reserveUSD
              dailyVolumeUSD
              dailyVolumeToken0
              dailyVolumeToken1
              token0 {
                id
                symbol
              }
              token1 {
                id
                symbol
              }
            }
          }
        `
      }),
      // As this store module is only ever for dual-asset pools, we can hardcode the index of the asset for these calls
      axios.get(`https://api.coingecko.com/api/v3/coins/${pool.assets[0].coinGeckoPathName}/market_chart/range`, {
        params: {
          vs_currency: 'usd',
          from,
          to,
        },
      }),
      axios.get(`https://api.coingecko.com/api/v3/coins/${pool.assets[1].coinGeckoPathName}/market_chart/range`, {
        params: {
          vs_currency: 'usd',
          from,
          to,
        },
      }),
    ])
      .then(_res => {
        log.info('pool:getChartData:success', _res)
        const shortestCGDataLength = Math.min(...[
          _res[1].data.prices.length,
          _res[2].data.prices.length,
        ])
        let graphData = _res[0].data.data.pairDayDatas
        graphData.reverse()
        const coinGeckoPricesAsset0 = _res[1].data.prices.map((item:any) => {
          const dateAsString = item[0].toString()
          return [
            Number(dateAsString.substring(0, dateAsString.length - 3)),
            item[1]
          ]
        })
        const coinGeckoPricesAsset1 = _res[2].data.prices.map((item:any) => {
          const dateAsString = item[0].toString()
          return [
            Number(dateAsString.substring(0, dateAsString.length - 3)),
            item[1]
          ]
        })

        console.log('datas', graphData, coinGeckoPricesAsset0, coinGeckoPricesAsset1)

        // graphData.forEach((item:any, index:any) => {
        //   console.log('gd: ', graphData[index].date)
        //   console.log('c0: ', coinGeckoPricesAsset0[index][0])
        //   console.log('c1: ', coinGeckoPricesAsset1[index][0])
        //   console.log('------')
        // })


        let volume:any = []
        let liquidity:any = []
        let feeReturns:any = []

        for (let index = 0; index < shortestCGDataLength; index++) {
          const targetDate = DateTime.fromObject({ hour: 0, minute: 0, second: 0 }).minus({ days: index }).toSeconds()
          console.log('targetDate: ', targetDate);

          const graphDataItem = graphData.find((item:any) => item.date === targetDate)
          console.log('graphDataItem: ', graphDataItem);
          const cgDataItem0 = coinGeckoPricesAsset0.find((item:any) => item[0] === targetDate)
          const assetPrice0 = cgDataItem0[1]
          console.log('assetPrice0: ', assetPrice0);

          const cgDataItem1 = coinGeckoPricesAsset1.find((item:any) => item[0] === targetDate)
          const assetPrice1 = cgDataItem1[1]
          console.log('assetPrice1: ', assetPrice1);

          // const date = DateTime.fromSeconds(item.date).toISO()
          // console.log('item.date: ', item.date);

          const parsedLiquidity = graphDataItem?.reserveUSD ? Big(graphDataItem.reserveUSD).toNumber() : 0



          // const assetPrice0Array = coinGeckoPricesAsset0.find((cgItem:any) => {
          //   const cgDateAsString = cgItem[0].toString()
          //   const cgDateWithoutMilliseconds = cgDateAsString.substring(0, cgDateAsString.length - 3)
          //   return Number(cgDateWithoutMilliseconds) === item.date
          // })
          // console.log('assetPrice0Array: ', assetPrice0Array);
          // const assetPrice0 = assetPrice0Array[1]
          // console.log('assetPrice0: ', assetPrice0);

          // const assetPrice1Array = coinGeckoPricesAsset1.find((cgItem:any) => {
          //   const cgDateAsString = cgItem[0].toString()
          //   const cgDateWithoutMilliseconds = cgDateAsString.substring(0, cgDateAsString.length - 3)
          //   return Number(cgDateWithoutMilliseconds) === item.date
          // })
          // console.log('assetPrice1Array: ', assetPrice1Array);
          // const assetPrice1 = assetPrice1Array[1]
          // console.log('assetPrice1: ', assetPrice1);

          let assetVolume0 = 0
          let assetVolume1 = 0
          if (graphDataItem) {
            if (graphDataItem.token0.id === pool.assets[0].contractAddress) {
              assetVolume0 = Big(graphDataItem.dailyVolumeToken0).toNumber()
              assetVolume1 = Big(graphDataItem.dailyVolumeToken1).toNumber()
            } else {
              assetVolume0 = Big(graphDataItem.dailyVolumeToken1).toNumber()
              assetVolume1 = Big(graphDataItem.dailyVolumeToken0).toNumber()
            }
          }
          console.log('assetVolume0: ', assetVolume0);
          console.log('assetVolume1: ', assetVolume1);

          const parsedVolume = (assetPrice0 * assetVolume0) + (assetPrice1 * assetVolume1)
          console.log('parsedVolume: ', parsedVolume);


          const parsedFeeReturns = (Math.pow((((parsedVolume * 0.003) / parsedLiquidity) + 1), 365)) -1

          volume.push([
            targetDate,
            parsedVolume,
          ])

          liquidity.push([
            targetDate,
            parsedLiquidity,
          ])

          feeReturns.push([
            targetDate,
            parsedFeeReturns,
          ])
        }

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
