import React, { FunctionComponent } from "react"

import { useStatsData } from "../../hooks/useGlobalState"
import { formatNumber } from "../../util/formatNumber"
import { Pool } from "../../Constants/Pool"

const PoolLiquidity = ({ pool }: { pool: Pool }) => {
    const liquidity = useStatsData(pool)?.liquidity
    return (
        <div className="flex flex-row w-full justify-between">
            <span className="font-bold">{ pool.name }</span>
            <span>${ formatNumber(liquidity, 2) }</span>
        </div>
    )
}

const AllPoolsCard: FunctionComponent = () => {
    return (
        <div className="flex-1 flex flex-col gradient-y rounded-md shadow-sm text-white text-xs px-2 py-1">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-col">
                    <span className="text-base font-bold">All pools</span>
                    <span className="text-sm text-gray-400 font-bold">Total liquidity</span>
                </div>
                <div className="flex flex-col space-y-1 text-sm mt-auto">
                    { Pool.values.map(pool => <PoolLiquidity pool={pool} />) }
                </div>
            </div>
        </div>
    )
}

export default AllPoolsCard