import fetch from "node-fetch";
import { Cache } from "./cache";
import { AllCoins, Contracts } from "./constants";

export class StatsProvider {

    static fetchChartData = async () => {
        return await Cache.getInstance().cachedValueOrClosureAsync("GLOBAL_CHARTDATA", async () => {
            const [prices, volumes] = await Promise.all([
                await Promise.all(AllCoins.map(coin => coin.fetchPrices())),
                await Promise.all(AllCoins.map(coin => coin.fetchVolumes()))
            ])
            const pricesPerCoin = {}
            const volumesPerCoin = {}
            AllCoins.forEach((coin, i) => { pricesPerCoin[coin.name] = prices[i] })
            AllCoins.forEach((coin, i) => { volumesPerCoin[coin.name] = volumes[i] })
            return {
                "prices": pricesPerCoin,
                "volumes": volumesPerCoin
            }
        }, parseInt(process.env.CACHE_TTL))
    }

    static fetchStats = async () => {
        return await Cache.getInstance().cachedValueOrClosureAsync("GLOBAL_STATS", async () => {
            const stats = await Promise.all(AllCoins.map(coin => coin.fetchStats()))
            const statsPerCoin = {}
            AllCoins.forEach((coin, i) => { statsPerCoin[coin.name] = stats[i] })
            return statsPerCoin
        }, parseInt(process.env.CACHE_TTL))
    }

}