import React, { FunctionComponent } from "react"
import { Pool } from "../../Constants/Pool"

const PoolActionsCard: FunctionComponent<{ pool: Pool }> = ({ pool }) => {
    return (
        <div className="flex-1 flex flex-col rounded-md shadow-sm text-gray-500 text-xs p-2 border border-gray-400 border-opacity-25">
            <span className="font-semibold">Transactions</span>
            <div className="flex-1 flex flex-col justify-center space-y-2" style={{ fontSize: "0.5rem" }}>
                { pool !== Pool.PHOENIX ? <div className="flex-1 flex flex-col items-center justify-center space-y-1">
                    <span className="text-sm font-thin">Trade</span>
                    <div className="flex flex-row w-full space-x-2">
                        <a
                            href={`https://app.uniswap.org/#/swap?outputCurrency=${ pool.address }`}
                            target="_blank" rel="noreferrer noopener"
                            className="flex-1 bg-blue-700 font-semibold text-white rounded-md p-2 text-center">
                            BUY { pool.name.split(" ")[0].toUpperCase() }
                        </a>
                        <a
                            href={`https://app.uniswap.org/#/swap?inputCurrency=${ pool.address }`}
                            target="_blank" rel="noreferrer noopener"
                            className="flex-1 bg-blue-700 font-semibold text-white rounded-md p-2 text-center">
                            SELL { pool.name.split(" ")[0].toUpperCase() }
                        </a>
                    </div>
                </div> : null }
                <div className="flex-1 flex flex-col items-center justify-center space-y-1">
                    <span className="text-sm font-thin">Liquidity Pool</span>
                    <div className="flex flex-row w-full space-x-2">
                        { pool === Pool.PHOENIX ? (
                            <a
                                href={`https://pools.balancer.exchange/#/pool/${ pool.address }`}
                                target="_blank" rel="noreferrer noopener"
                                className="flex-1 bg-blue-400 font-semibold text-white rounded-md p-2 text-center">
                                ADD/REMOVE LIQUIDITY
                            </a>
                        ) : <>
                            <a
                                href={`https://app.uniswap.org/#/add-liquidity?token=${ pool.address }`}
                                target="_blank" rel="noreferrer noopener"
                                className="flex-1 bg-blue-400 font-semibold text-white rounded-md p-2 text-center">
                                ADD LIQUIDITY
                            </a>
                            <a
                                href={`https://app.uniswap.org/#/remove-liquidity?token=${ pool.address }`}
                                target="_blank" rel="noreferrer noopener"
                                className="flex-1 bg-blue-400 font-semibold text-white rounded-md p-2 text-center">
                                REMOVE LIQUIDITY
                            </a>
                        </> }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PoolActionsCard