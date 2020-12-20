import React, { FunctionComponent } from "react"
import { Pool } from "../../Constants/Pool"
import { useTokenBalance } from "../../hooks/useTokenBalance"
import { formatNumber } from "../../util/formatNumber"

const SinglePoolBalance: FunctionComponent<{ pool: Pool }> = ({ pool }) => {
    return (
        <div className="flex flex-row items-center justify-between text-gray-800 space-x-2 shadow-sm rounded-md bg-blue-100 bg-opacity-25 p-1">
            <div className="flex flex-row items-center space-x-2 font-bold">
                <img src={pool.image} alt={pool.id} className="w-6"/>
                <span className="">{ pool.name }</span>
            </div>
            <span className="font-bold">{ formatNumber(useTokenBalance(pool.address)?.toSignificant(6) || "") } { pool.symbol }</span>
        </div>
    )
}

const PoolBalance = () => {

    return (
        <div className="flex-1 flex flex-col rounded-md shadow-sm text-white text-xs pb-2 border border-gray-400 border-opacity-25">
            <span className="text-gray-600 m-2 font-semibold">Pools Balances</span>
            <div className="flex flex-col space-y-2 my-auto p-2">
                { Pool.values.map(p => <SinglePoolBalance key={p.id} pool={p} />) }
            </div>
        </div>
    )
}

export default PoolBalance