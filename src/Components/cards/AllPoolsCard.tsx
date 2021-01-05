import React, { FunctionComponent } from "react"

import { useStatsData } from "../../hooks/useGlobalState"
import { formatNumber } from "../../util/formatNumber"
import { Pool } from "../../Constants/Pool"

const PoolLiquidity = ({ pool }: { pool: Pool }) => {
    const liquidity = useStatsData(pool)?.liquidity
    return (
        <div className="flex flex-row items-center justify-between space-x-2 shadow-sm rounded-md bg-blue-900 bg-opacity-25 p-1 text-white">
            <div className="flex flex-row items-center space-x-2 font-bold">
                <img src={pool.image} alt={pool.id} className="w-6 bg-white rounded-full p-1"/>
                <span>{ pool.name }</span>
            </div>
            <span className="font-bold">${ formatNumber(liquidity, 2) }</span>
        </div>
    )
}

const AllPoolsCard: FunctionComponent = () => {
    return (
        <div className="flex-1 flex flex-col gradient-y rounded-md shadow-sm text-white text-xs px-2 py-1">
            <div className="flex-1 flex flex-col">
                <div className="flex-1 flex flex-row">
                    <span className="text-base font-bold">All pools - <b className="font-normal">Total liquidity</b></span>
                </div>
                <div className="flex flex-col space-y-2 text-sm mt-auto mb-1">
                    { Pool.values.map(pool => <PoolLiquidity key={pool.id} pool={pool} />) }
                </div>
            </div>
        </div>
    )
}

export default AllPoolsCard