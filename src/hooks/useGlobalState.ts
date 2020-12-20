import { CurrencyAmount } from "@uniswap/sdk"
import { parseEther } from "ethers/lib/utils"
import { useContext, useMemo } from "react"
import { Pool } from "../Constants/Pool"
import { Context } from "../Store"
import { Api } from "../util/api"
import { formatNumber } from "../util/formatNumber"

export const useETHPrice = () => {
    const { state } = useContext(Context)
    return state.ethPrice
}

export const useStatsData = (pool: Pool | null) => {
    const { state } = useContext(Context)
    return (state.statsData || {})[pool ? pool.id : "all"] || {}
}

export const useChartData = (type: "price" | "volume", pool: Pool | null) => {
    const { state } = useContext(Context)
    return useMemo(() => {
        switch (type) {
            case "price":   return (state.chartData["prices"] || {})[pool ? pool.id : "all"] || {}
            case "volume":  {
                const chartData = (state.chartData["volumes"] || {})[pool ? pool.id : "all"] || {}
                const additionalTimeframes = [["1w", 7], ["30d", 30]]
                if (chartData["all"]) {
                    additionalTimeframes.forEach(([label, days]) => {
                        chartData[label] = chartData["all"].slice(-days)
                    })
                }
                return chartData
            }
        }
    }, [type, pool, state.chartData])
}

export const useFormattedChartData = (type: "price" | "volume", pool: Pool | null, period: string) => {
    const data = useChartData(type, pool)
    return useMemo(() => ((data[period] || []) as [number, number][]).map(([timestamp, value]: [number, number]) => ({ x: timestamp, y: value || 0 })), [data, period])
}

export const fetchETHPrice = async () => {
    const result = await Api.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd", true)
    const price = result.ethereum.usd as number
    return CurrencyAmount.ether(parseEther(price.toString()).toString())
}

export const usePrice = (price: CurrencyAmount | undefined, currency: "eth" | "usd") => {
    const { state: { currency: targetCurrency } } = useContext(Context)
    const ethPrice = useETHPrice()
    if (!price) return undefined
    const convertedPrice = (() => {
        if (currency === targetCurrency) return price
        if (!ethPrice) return undefined
        return targetCurrency === "eth" ? ethPrice.multiply(price.raw).divide((10 ** 18).toString()) : ethPrice.multiply((10 ** 18).toString()).divide(price.raw)
    })()
    return convertedPrice ? `${currency === "eth" ? "Ξ " : "$"}${formatNumber(convertedPrice.toSignificant(4))}` : undefined
}