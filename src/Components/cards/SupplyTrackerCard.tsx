import { CurrencyAmount } from "@uniswap/sdk"
import React, { FunctionComponent, useContext } from "react"
import { Pool } from "../../Constants/Pool"
import { useApiResult } from "../../hooks/useApiResult"
import { useFormattedChartData, useStatsData } from "../../hooks/useGlobalState"
import { Context } from "../../Store"
import { formatNumber } from "../../util/formatNumber"

const SinglePoolSupply: FunctionComponent<{ pool: Pool }> = ({ pool }) => {

    const { supply } = useStatsData(pool)

    return (
        <div className="flex flex-row items-center justify-end text-gray-800 space-x-2">
            <span className="text-right">{ supply ? `${formatNumber(CurrencyAmount.ether(supply).toFixed(4))} ${pool.symbol}` : "" }</span>
            <div className="flex flex-row items-center">
                <img src={pool.image} alt={pool.id} className="w-6"/>
            </div>
        </div>
    )
}

const SupplyTrackerCard = () => {

    return (
        <div className="flex-1 flex flex-col rounded-md shadow-sm text-white text-xs pb-2 border border-gray-400 border-opacity-25">
            <span className="text-gray-500 m-2 font-semibold">Supply Tracker</span>
            <div className="flex flex-col space-y-4 my-auto p-2">
                { Pool.values.map(p => <SinglePoolSupply key={p.id} pool={p} />) }
            </div>
        </div>
    )
}

export default SupplyTrackerCard