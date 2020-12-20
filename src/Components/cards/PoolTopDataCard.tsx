import React, { FunctionComponent } from "react"
import { NavLink, useLocation } from "react-router-dom"

import classnames from "classnames"

import { Pool } from "../../Constants/Pool"
import { formatNumber } from "../../util/formatNumber"
import { useFormattedChartData, useStatsData } from "../../hooks/useGlobalState"

const PoolTopDataCard: FunctionComponent<{ pool: Pool }> = ({ pool }) => {

    const poolData = useStatsData(pool)
    const apy = poolData["apy"] as Record<string, any>
    const marketData = poolData["marketData"] as Record<string, number>

    const location = useLocation()
    const dim = location.pathname !== "/" && location.pathname !== `/${pool.id}`

    const priceData = useFormattedChartData("price", pool, "24h")
    const priceUSD = marketData ? marketData["current_price"] : (priceData[priceData.length - 1]?.y || 0)

    return (
        <div className="relative flex-1 flex flex-col gradient-y rounded-md shadow-sm text-white text-xs">
            <NavLink className={classnames("absolute w-full h-full bg-black rounded-md z-10", dim ? "opacity-50" : "opacity-0")} to={`/${pool.id}`} />
            <div className="flex flex-row p-2 space-x-2">
                <div className="flex flex-col items-center space-y-1 w-12">
                    <div className="flex flex-row items-center justify-center w-12 h-12 bg-white rounded-full shadow-md">
                        <img alt={pool.name} src={pool.image} className="w-8 h-8" />
                    </div>
                    <span className="font-bold">${pool.symbol}</span>
                </div>
                <div className="flex-1 flex flex-row pt-1">
                    <div className="flex-1 flex flex-col">
                        <span className="text-base font-bold">{ pool.name }</span>
                        <span className="">${ formatNumber(priceUSD) }</span>
                    </div>
                </div>
            </div>
            { apy ? <>
                <hr className="opacity-25 mt-auto" />
                <div className="h-16 flex flex-row items-center p-2 space-x-2">
                    <span className="text-base opacity-75 font-bold">%APY</span>
                    <div className="flex-1 flex flex-row justify-around">
                        { Object.entries(apy).sort().map(([label, value]: [string, number]) => (
                            <div className="flex flex-col items-center" key={label}>
                                <span className="font-thin opacity-75">{ label }</span>
                                <span className="">{ formatNumber(value, 2) }</span>
                            </div>
                        )) }
                    </div>
                </div>
            </> : null }
            { marketData ? <>
                <hr className="opacity-25 mt-auto" />
                <div className="h-16 flex flex-col items-start p-2 justify-around">
                    <div className="flex flex-row justify-between w-full">
                        <span className="font-bold">Circulating Supply: </span>
                        <span className="font-bold">{ formatNumber(marketData["circulating_supply"], 2) } { pool.symbol }</span>
                    </div>
                    <div className="flex flex-row justify-between w-full">
                        <span className="font-bold">Market Cap: </span>
                        <span className="font-bold">${ formatNumber(marketData["market_cap"], 2) }</span>
                    </div>
                </div>
            </> : null }
        </div>
    )
}

export default PoolTopDataCard