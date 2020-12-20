import { Coin } from './model/coin';

import fetch from "node-fetch"
import { RateLimiter } from './rate-limiter';
import { getTimeframeInterval, getTimeframeOptions, getTimeframeOptionsDays, Timeframe } from './util';
import { getCurrentLiquidity, getTokenAPY, getTokenPriceHistory, getTokenVolumeHistory } from './apollo/util';
import { Cache } from './cache';

enum Contracts {
    statera = '0xa7de087329bfcda5639247f96140f9dabe3deed1',
    bpt = '0xcd461b73d5fc8ea1d69a600f44618bdfac98364d',
    delta = '0x59f96b8571e3b11f859a09eaf5a790a138fc64d0',

    weth = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
};

const AllContracts = Object.keys(Contracts).map((x) => Contracts[x]);

const fetchPricesWithPeriods = async (address: string, periods: Timeframe[], source: "uniswap" | "balancer") => {
    const result = {}
    await Promise.all(periods.map(async period => { 
        const [startTime, interval] = Cache.getInstance().cachedValueOrClosure(`TIMEFRAME_${period}`, () => getTimeframeOptions(period), 30 * 60)
        result[period] = await getTokenPriceHistory(address, startTime, interval, source)
    }))
    return result
}

const fetchVolumesWithPeriods = async (address: string, periods: Timeframe[], source: "uniswap" | "balancer") => {
    const result = {}
    await Promise.all(periods.map(async period => { 
        const [startTime, interval] = Cache.getInstance().cachedValueOrClosure(`TIMEFRAME_${period}`, () => getTimeframeOptions(period), 30 * 60)
        result[period] = await getTokenVolumeHistory(address, startTime, interval, source)
    }))
    return result
}

const fetchAPYs = async (address: string, periods: Timeframe[], source: "uniswap" | "balancer") => {
    const result = {}
    await Promise.all(periods.map(async period => {
        const days = getTimeframeOptionsDays(period)
        const [startTime, ] = getTimeframeOptions(period)
        const interval = getTimeframeInterval(period)
        result[period] = await getTokenAPY(address, startTime, interval, days, source)
    }))
    return result
}

const fetchCoingeckoSupply = async (address: string) => {
    return (await (await fetch(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${address}&apikey=${"9JZTPJHQPBX716RAK6G9ZWVJT4EZHG1N51"}`)).json())["result"]
}
const fetchCoingeckoMarketData = async (name: string) => {
    const result = (await (await fetch(`https://api.coingecko.com/api/v3/coins/${name}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`)).json())
    return {
        "circulating_supply": result["market_data"]["circulating_supply"],
        "current_price": result["market_data"]["current_price"]["usd"],
        "market_cap": result["market_data"]["market_cap"]["usd"]
    }
}

const STATERA = new Coin('statera', 'STA', Contracts.statera, 'statera',
    async () => await fetchPricesWithPeriods(Contracts.statera, ["24h", "30d", "all"], "uniswap"),
    async () => await fetchVolumesWithPeriods("0x59f96b8571e3b11f859a09eaf5a790a138fc64d0", ["all"], "uniswap"),
    async () => {
        return {
            marketData: await fetchCoingeckoMarketData("statera"),
            supply: await fetchCoingeckoSupply(Contracts.statera),
            liquidity: await getCurrentLiquidity("0x59f96b8571e3b11f859a09eaf5a790a138fc64d0", "uniswap")
        }
    })
const DELTA = new Coin('delta', 'UNI-V2', Contracts.delta, null,
    async () => await fetchPricesWithPeriods(Contracts.delta, ["24h", "30d", "all"], "uniswap"),
    async () => await fetchVolumesWithPeriods("0x542bca1257c734d58fbea2edbb8f2f3a01eb306d", ["all"], "uniswap"),
    async () => {
        return {
            apy: await fetchAPYs(Contracts.delta, ["24h", "1w", "30d"], "uniswap"),
            supply: await fetchCoingeckoSupply(Contracts.delta),
            liquidity: await getCurrentLiquidity("0x542bca1257c734d58fbea2edbb8f2f3a01eb306d", "uniswap")
        }
    })
const PHOENIX = new Coin("phoenix", "BPT", Contracts.bpt, null,
    async () => await fetchPricesWithPeriods(Contracts.bpt, ["24h", "30d", "all"], "balancer"),
    async () => await fetchVolumesWithPeriods(Contracts.bpt, ["all"], "balancer"),
    async () => {
        return {
            apy: await fetchAPYs(Contracts.bpt, ["24h", "1w", "30d"], "balancer"),
            supply: await fetchCoingeckoSupply(Contracts.bpt),
            liquidity: await getCurrentLiquidity(Contracts.bpt, "balancer")
        }
    })

const AllCoins = [STATERA, DELTA, PHOENIX];

export { Contracts, AllContracts, STATERA, DELTA, AllCoins };
