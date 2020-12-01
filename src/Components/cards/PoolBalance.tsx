import React, { FunctionComponent } from "react"
import { Pool } from "../../Constants/Pool"
import { useTokenBalance } from "../../hooks/useTokenBalance"
import { formatNumber } from "../../util/formatNumber"

const SinglePoolBalance: FunctionComponent<{ pool: Pool }> = ({ pool }) => {
    return (
        <div className="flex flex-row items-center justify-between text-gray-800">
            <div className="flex flex-row items-center space-x-2">
                <img src={pool.image} alt={pool.id} className="w-6"/>
                <span className="font-bold text-base">{ pool.name }</span>
            </div>
            <span>{ formatNumber(useTokenBalance(pool.address)?.toSignificant(6) || "") } { pool.symbol }</span>
        </div>
    )
}

const PoolBalance = () => {

    return (
        <div className="flex-1 flex flex-col rounded-md shadow-sm text-white text-xs pb-2 border border-gray-400 border-opacity-25">
            <span className="text-gray-500 m-2 font-semibold">Pools Balances</span>
            <div className="flex flex-col space-y-4 my-auto p-2">
                { Pool.values.map(p => <SinglePoolBalance key={p.id} pool={p} />) }
            </div>
        </div>
    )
}

export default PoolBalance