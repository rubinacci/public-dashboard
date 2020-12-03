import { CurrencyAmount } from "@uniswap/sdk"
import React, { FunctionComponent } from "react"
import { Pool } from "../../Constants/Pool"
import { useApiResult } from "../../hooks/useApiResult"
import { formatNumber } from "../../util/formatNumber"

const SinglePoolSupply: FunctionComponent<{ pool: Pool }> = ({ pool }) => {

    const ETHERSCAN_API_KEY = "9JZTPJHQPBX716RAK6G9ZWVJT4EZHG1N51"
    const { data } = useApiResult(
        `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${pool.address}&apikey=${ETHERSCAN_API_KEY}`,
        {}, true)
    const totalSupply = (data as any)["result"]

    return (
        <div className="flex flex-row items-center justify-end text-gray-800 space-x-2">
            <span className="text-right">{ totalSupply ? `${formatNumber(CurrencyAmount.ether(totalSupply).toFixed(4))} ${pool.symbol}` : "" }</span>
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