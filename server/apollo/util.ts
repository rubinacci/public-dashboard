import { balancerClient, blockClient, uniswapClient } from "./client"
import { GET_BLOCKS, UNISWAP_PRICES_BY_BLOCK, BALANCER_PRICES_BY_BLOCK, UNISWAP_PAIR_CHART, UNISWAP_TOKEN_DAILY_DATA, BALANCER_DAILY_SWAP_FEE, BALANCER_DAILY_VOLUME } from "./graphql_queries"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { Cache } from "../cache"
import { getTimeframeOptions } from "../util"
dayjs.extend(utc)

export async function splitQuery(query, localClient, vars, list, skipCount = 100) {
    let fetchedData = {}
    let allFound = false
    let skip = 0
  
    while (!allFound) {
        let end = list.length
        if (skip + skipCount < list.length) {
            end = skip + skipCount
        }
        let sliced = list.slice(skip, end)
        let result = sliced.length > 0 ? await localClient.query({
            query: query(...vars, sliced),
            fetchPolicy: 'cache-first',
        }) : { data: {} }
        fetchedData = {
            ...fetchedData,
            ...result.data,
        }
        if (Object.keys(result.data).length < skipCount || skip + skipCount > list.length) {
            allFound = true
        } else {
            skip += skipCount
        }
    }
  
    return fetchedData
}

export async function getBlocksFromTimestamps(timestamps, skipCount = 500) {
    if (timestamps?.length === 0) {
        return []
    }

    let fetchedData = await splitQuery(GET_BLOCKS, blockClient, [], timestamps, skipCount)
  
    let blocks = []
    if (fetchedData) {
        for (var t in fetchedData) {
            if (fetchedData[t].length > 0) {
                blocks.push({
                    timestamp: t.split('t')[1],
                    number: fetchedData[t][0]['number'],
                })
            }
        }
    }
    return blocks
}

export const getBlockIntervalFromStartTime = async (startTime: number, interval: number) => {
    const utcEndTime = dayjs.utc()
    let time = startTime

    // create an array of hour start times until we reach current hour
    // buffer by half hour to catch case where graph isnt synced to latest block
    const timestamps = []
    while (time < utcEndTime.unix() - 30 * 60) {
        timestamps.push(time)
        time += interval
    }

    // backout if invalid timestamp format
    if (timestamps.length === 0) {
        return []
    }

    return await getBlocksFromTimestamps(timestamps)
}

export const getTokenPriceHistory = async (address: string, startTime: number, interval: number, source: "uniswap" | "balancer") => {
    const blocks = await Cache.getInstance().cachedValueOrClosureAsync(
        `BLOCKS_FROM_TIMESTAMP_${startTime}_${interval}`,
        async () => await getBlockIntervalFromStartTime(startTime, interval),
        30 * 60)
    switch (source) {
      case "uniswap": {
        const result = await splitQuery(UNISWAP_PRICES_BY_BLOCK, uniswapClient, [address], blocks, 50)
        const values = Object.keys(result).filter(r => !!result[r]).map(r => r.split("t")[1]).filter(r => !!r).map(timestamp => {
          const derivedETH = parseFloat(result[`t${timestamp}`].derivedETH)
          const ethPrice = result[`b${timestamp}`].ethPrice
          const priceUSD = derivedETH * ethPrice
          return [parseInt(timestamp), priceUSD]
        })
        return values
      }
      case "balancer": {
        const result = await splitQuery(BALANCER_PRICES_BY_BLOCK, balancerClient, [address], blocks, 50)
        const values = Object.keys(result).filter(r => !!result[r]).map(r => r.split("t")[1]).filter(r => !!r).map(timestamp => {
          const liquidity = parseFloat(result[`t${timestamp}`].liquidity)
          const totalShares = parseFloat(result[`t${timestamp}`].totalShares)
          const priceUSD = liquidity / totalShares
          return [parseInt(timestamp), priceUSD]
        })
        return values
      }
    }
}

export const getTokenVolumeHistory = async (pairAddress, startTime: number, interval: number, source: "uniswap" | "balancer") => {
  switch (source) {
    case "uniswap": {
      let data = []
      const utcEndTime = dayjs.utc()
      startTime = getTimeframeOptions("all")[0]
    
      try {
        let allFound = false
        let skip = 0
        while (!allFound) {
          let result = await uniswapClient.query({
            query: UNISWAP_PAIR_CHART,
            variables: {
              pairAddress: pairAddress,
              skip,
            },
            fetchPolicy: 'cache-first',
          })
          skip += 1000
          data = data.concat(result.data.pairDayDatas)
          if (result.data.pairDayDatas.length < 1000) {
            allFound = true
          }
        }
    
        let dayIndexSet = new Set()
        let dayIndexArray = []
        const oneDay = 24 * 60 * 60
        data.forEach((dayData, i) => {
          // add the day index to the set of days
          dayIndexSet.add((data[i].date / oneDay).toFixed(0))
          dayIndexArray.push(data[i])
          dayData.dailyVolumeUSD = parseFloat(dayData.dailyVolumeUSD)
          dayData.reserveUSD = parseFloat(dayData.reserveUSD)
        })
    
        if (data[0]) {
          // fill in empty days
          let timestamp = data[0].date ? data[0].date : startTime
          let latestLiquidityUSD = data[0].reserveUSD
          let index = 1
          while (timestamp < utcEndTime.unix() - oneDay) {
            const nextDay = timestamp + oneDay
            let currentDayIndex = (nextDay / oneDay).toFixed(0)
            if (!dayIndexSet.has(currentDayIndex)) {
              data.push({
                date: nextDay,
                dayString: nextDay,
                dailyVolumeUSD: 0,
                reserveUSD: latestLiquidityUSD,
              })
            } else {
              latestLiquidityUSD = dayIndexArray[index].reserveUSD
              index = index + 1
            }
            timestamp = nextDay
          }
        }
    
        data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1))
      } catch (e) {
        console.log(e)
      }
    
      return data.map(({ date, dailyVolumeUSD }) => [date, dailyVolumeUSD])
    }
    case "balancer": {
      interval = 3600 * 24
      const blocks = await Cache.getInstance().cachedValueOrClosureAsync(
        `BLOCKS_FROM_TIMESTAMP_${startTime}_${interval}`,
        async () => await getBlockIntervalFromStartTime(startTime, interval),
        30 * 60)
      const result = await splitQuery(BALANCER_DAILY_VOLUME, balancerClient, [pairAddress], blocks, 50)

      const queryLabels = Object.keys(result)
      const volumes = queryLabels.filter(r => !!result[r]).map(r => r.split("t")[1]).filter(r => !!r).map((timestamp, i) => {
        const totalSwapVolume = parseFloat(result[`t${timestamp}`].totalSwapVolume)
        const deltaVolume = totalSwapVolume - (i === 0 ? 0 : parseFloat(result[queryLabels[i-1]].totalSwapVolume))
        return [parseInt(timestamp), deltaVolume]
      })
      return volumes
    }
  }
}

export const getTokenAPY = async (address: string, startTime: number, interval: number, days: number, source: "uniswap" | "balancer") => {
  switch (source) {
    case "uniswap": {
      const result = await uniswapClient.query({
        query: UNISWAP_TOKEN_DAILY_DATA(address, days),
        fetchPolicy: 'cache-first',
      })
      const periodRoi = result.data.tokenDayDatas.map(dayData => {
        const UNISWAP_FEES =  0.3 / 100
        const fees = UNISWAP_FEES * dayData.dailyVolumeUSD
        const roi = fees / dayData.totalLiquidityUSD
        return roi
      }).reduce((a, b) => a + b, 0)
      const yearlyRoi = periodRoi * 365 / days * 100
      return yearlyRoi
    }
    case "balancer": {
      const blocks = await Cache.getInstance().cachedValueOrClosureAsync(
        `BLOCKS_FROM_TIMESTAMP_${startTime}_${interval}`,
        async () => await getBlockIntervalFromStartTime(startTime, interval),
        30 * 60)
      const result = await splitQuery(BALANCER_DAILY_SWAP_FEE, balancerClient, [address], blocks, 50)

      const queryLabels = Object.keys(result)
      const periodRoi = queryLabels.filter(r => !!result[r]).map(r => r.split("t")[1]).filter(r => !!r).map((timestamp, i) => {
        const liquidity = parseFloat(result[`t${timestamp}`].liquidity)
        const totalSwapFee = parseFloat(result[`t${timestamp}`].totalSwapFee)
        const deltaSwapFee = totalSwapFee - (i === 0 ? 0 : parseFloat(result[queryLabels[i-1]].totalSwapFee))
        const roi = deltaSwapFee / liquidity
        return roi
      }).reduce((a, b) => a + b, 0)
      const yearlyRoi = periodRoi * 365 / days
      return yearlyRoi
    }
  }
}