import React, { FunctionComponent } from "react"
import { Pool } from "../Constants/Pool"
import { useApiResult } from "../hooks/useApiResult"

const PoolTopDataCard: FunctionComponent<{ pool: Pool }> = ({ pool }) => {

    const poolData = useApiResult("/stats", { topData: {} as Record<string, Record<string, string>> }).data.topData[pool.id] || {}
    const apy = poolData["apy"] || {} as Record<string, string>

    return (
        <div className="flex-1 flex flex-col gradient-y rounded-md shadow-md text-white text-xs">
            <div className="flex flex-row p-2 space-x-2">
                <div className="flex flex-col items-center space-y-1 w-12">
                    <div className="h-12">
                        <img alt={pool.name} src={pool.image} className="w-full" />
                    </div>
                    <span className="font-bold">${pool.symbol}</span>
                </div>
                <div className="flex-1 flex flex-row pt-1">
                    <div className="flex-1 flex flex-col">
                        <span className="text-base font-bold">{ pool.name }</span>
                        <span className="font-thin opacity-50">???</span>
                        <span className="font-bold text-xs mt-auto">{ poolData["sta"] }</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="opacity-50 font-thin">Shares</span>
                        <span className="font-thin">{ poolData["shares"] }</span>
                        <span className="mt-auto">Ξ ???</span>
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
                            <span className="">{ value }</span>
                        </div>
                    )) }
                </div>
            </div>
        </div>
    )
}

export default PoolTopDataCard