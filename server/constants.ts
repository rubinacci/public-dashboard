
import { Coin } from './model/coin';

import fetch from "node-fetch"
import { RateLimiter } from './rate-limiter';
import { getTimeframeOptions, Timeframe } from './util';
import { getTokenPriceHistory, getUniswapVolumeHistory } from './apollo/util';
import { Cache } from './cache';

enum Contracts {
    statera = '0xa7de087329bfcda5639247f96140f9dabe3deed1',
    wbtc = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    weth = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    
    link = '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    snx = '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    delta = '0x59f96b8571e3b11f859a09eaf5a790a138fc64d0',
    bpt = '0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'
};

const AllContracts = Object.keys(Contracts).map((x) => Contracts[x]);

const fetchUniswapPricesWithPeriods = async (address: string, periods: Timeframe[]) => {
    const result = {}
    await Promise.all(periods.map(async period => { 
        const [startTime, interval] = Cache.getInstance().cachedValueOrClosure(`TIMEFRAME_${period}`, () => getTimeframeOptions(period), 30 * 60)
        result[period] = await getTokenPriceHistory(address, startTime, interval, "uniswap")
    }))
    return result
}

const fetchUniswapVolumesWithPeriods = async (address: string, periods: Timeframe[]) => {
    const result = {}
    await Promise.all(periods.map(async period => { 
        const [startTime, interval] = Cache.getInstance().cachedValueOrClosure(`TIMEFRAME_${period}`, () => getTimeframeOptions(period), 30 * 60)
        result[period] = await getUniswapVolumeHistory(address)
    }))
    return result
}

const fetchCoingeckoSupply = async (address: string) => {
    return (await (await fetch(`https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${address}&apikey=${"9JZTPJHQPBX716RAK6G9ZWVJT4EZHG1N51"}`)).json())["result"]
}

const STATERA = new Coin('statera', 'STA', Contracts.statera, 'statera',
    async () => await fetchUniswapPricesWithPeriods(Contracts.statera, ["24h", "30d", "all"]),
    async () => await fetchUniswapVolumesWithPeriods("0x59f96b8571e3b11f859a09eaf5a790a138fc64d0", ["daily"]),
    async () => {
        return {
            supply: await fetchCoingeckoSupply(Contracts.statera)
        }
    })
const DELTA = new Coin('delta', 'UNI-V2', Contracts.delta, null,
    async () => await fetchUniswapPricesWithPeriods(Contracts.delta, ["24h", "30d", "all"]),
    async () => await fetchUniswapVolumesWithPeriods("0x542bca1257c734d58fbea2edbb8f2f3a01eb306d", ["daily"]),
    async () => {
        return {
            supply: await fetchCoingeckoSupply(Contracts.delta)
        }
    })
const PHOENIX = new Coin("phoenix", "BPT", Contracts.bpt, null,
    async () => {
        return {}
    },
    async () => {
        return {}
    },
    async () => {
        return {
            supply: await fetchCoingeckoSupply(Contracts.bpt)
        }
    })

const AllCoins = [STATERA, DELTA, PHOENIX];

export { Contracts, AllContracts, STATERA, DELTA, AllCoins };
