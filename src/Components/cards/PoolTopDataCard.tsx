import React, { FunctionComponent } from "react"
import { NavLink, useLocation } from "react-router-dom"

import classnames from "classnames"

import { Pool } from "../../Constants/Pool"
import { formatNumber } from "../../util/formatNumber"
import { usePrice, useStatsData } from "../../hooks/useETHPrice"
import { CurrencyAmount } from "@uniswap/sdk"
import { parseEther } from "ethers/lib/utils"

const PoolTopDataCard: FunctionComponent<{ pool: Pool }> = ({ pool }) => {

    const poolData = useStatsData(pool)
    const apy = poolData["apy"] || {} as Record<string, string>

    const location = useLocation()
    const dim = location.pathname !== "/" && location.pathname !== `/${pool.id}`

    const priceSTA = poolData["sta"]
    const priceUSD = poolData["staxeth"]

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
                        <span className="mt-auto">{ usePrice(priceUSD ? CurrencyAmount.ether(parseEther(priceUSD).toString()) : undefined, "usd") }</span>
                        <span className="font-bold text-xs mt-auto">{ formatNumber(priceSTA) }</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="opacity-50 font-thin">Shares</span>
                        <span className="font-thin">{ poolData["shares"] }</span>
                    </div>
                </div>
            </div>
            <hr className="opacity-25" />
            <div className="flex-1 flex flex-row items-center p-2 space-x-2">
                <span className="font-thin text-base opacity-50">%APY</span>
                <div className="flex-1 flex flex-row justify-between">
                    { Object.entries(apy).map(([label, value]) => (
                        <div className="flex flex-col items-center" key={label}>
                            <span className="font-thin opacity-50">{ label }</span>
                            <span className="">{ value as string }</span>
                        </div>
                    )) }
                </div>
            </div>
        </div>
    )
}

export default PoolTopDataCard