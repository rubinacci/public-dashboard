import React, { FunctionComponent } from "react"
import { Pool } from "../../Constants/Pool"

const Tooltip = () => (
    <span className="absolute bottom-0 left-0 mb-12 p-2 w-full bg-white shadow-lg text-red-400 invisible opacity-0 parent-hover:visible rounded-md transition-all duration-300">
        Set slippage tolerance above 1%. Check the side bar for detailed instructions
        <svg className="absolute text-white h-2 w-full left-0 top-full mt-2" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
    </span>
)

const PoolActionsCard: FunctionComponent<{ pool: Pool }> = ({ pool }) => {
    return (
        <div className="flex-1 flex flex-col rounded-md shadow-sm text-gray-500 text-xs p-2 border border-gray-400 border-opacity-25">
            <span className="font-semibold">Transactions</span>
            <div className="flex-1 flex flex-col justify-center space-y-2">
                { pool !== Pool.STANOS ? <div className="flex-1 flex flex-col items-center justify-center space-y-1">
                    <span className="text-sm font-thin">Trade</span>
                    <div className="flex flex-row w-full space-x-2">
                        <a
                            href={`https://app.uniswap.org/#/swap?outputCurrency=${ pool.address }`}
                            target="_blank" rel="noreferrer noopener"
                            className="relative flex-1 bg-blue-700 font-semibold text-white rounded-md p-2 px-0 text-center">
                            BUY { pool.symbol.toUpperCase() }
                            { pool === Pool.STATERA ? <Tooltip /> : null }
                        </a>
                        <a
                            href={`https://app.uniswap.org/#/swap?inputCurrency=${ pool.address }`}
                            target="_blank" rel="noreferrer noopener"
                            className="relative flex-1 bg-blue-700 font-semibold text-white rounded-md p-2 px-0 text-center">
                            SELL { pool.symbol.toUpperCase() }
                            { pool === Pool.STATERA ? <Tooltip /> : null }
                        </a>
                    </div>
                </div> : null }
                <div className="flex-1 flex flex-col items-center justify-center space-y-1">
                    <span className="text-sm font-thin">Liquidity Pool</span>
                    <div className="flex flex-row w-full space-x-2">
                        { pool === Pool.STANOS ? (
                            <a
                                href={`https://pools.balancer.exchange/#/pool/${ pool.address }`}
                                target="_blank" rel="noreferrer noopener"
                                className="flex-1 bg-blue-400 font-semibold text-white rounded-md p-2 px-0 text-center">
                                ADD/REMOVE LIQUIDITY
                            </a>
                        ) : <>
                            <a
                                href={`https://app.uniswap.org/#/add/${ pool.address }/ETH`}
                                target="_blank" rel="noreferrer noopener"
                                className="flex-1 bg-blue-400 font-semibold text-white rounded-md p-2 px-0 text-center">
                                ADD LIQUIDITY
                            </a>
                            <a
                                href={`https://app.uniswap.org/#/remove/${ pool.address }/ETH`}
                                target="_blank" rel="noreferrer noopener"
                                className="flex-1 bg-blue-400 font-semibold text-white rounded-md p-2 px-0 text-center">
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