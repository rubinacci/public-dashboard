import React, { FunctionComponent } from "react"

import { usePrice, useStatsData } from "../../hooks/useGlobalState"
import { CurrencyAmount } from "@uniswap/sdk"
import { parseEther } from "ethers/lib/utils"
import { formatNumber } from "../../util/formatNumber"

const AllPoolsCard: FunctionComponent = () => {

    const data = useStatsData(null)
    const apy = data["apy"] || {} as Record<string, string>

    const priceSTA = data["sta"]
    const priceUSD = data["staxeth"]

    return (
        <div className="flex-1 flex flex-col gradient-y rounded-md shadow-sm text-white text-xs">
            <div className="flex flex-row p-2 space-x-2">
                
                <div className="flex-1 flex flex-row pt-1">
                    <div className="flex-1 flex flex-col">
                        <span className="text-base font-bold">All pools</span>
                        { /*<DimensionsProvider className="w-32 h-12 flex flex-row items-center justify-center" render={({ width, height }) => 
                            <ReactApexChart
                                type="area"
                                width={width}
                                height={height}
                                series={[{ data: [31, 40, 28, 51, 42, 109, 100] }]}
                                options={{
                                    chart: { toolbar: { show: false }, sparkline: { enabled: true } },
                                    dataLabels: { enabled: false },
                                    yaxis: { show: false },
                                    xaxis: { labels: { show: false } },
                                    stroke: { curve: 'smooth' },              
                                    floating: true,
                                    colors: ["#ffffff", "#FF0000"],
                                    axisTicks: { show: false },
                                    axisBorder: { show: false },
                                    labels: { show: false },
                                    legend: { show: false },
                                    tooltip: { custom: (e: any) => CustomTooltip({ ...e, format: true }) }        
                                }} />
                            } />*/ }
                    </div>
                    <div className="flex flex-col space-y-2 justify-end items-end font-bold text-md">
                        <span className="mt-auto">{ usePrice(priceUSD ? CurrencyAmount.ether(parseEther(priceUSD).toString()) : undefined, "usd") }</span>
                        <span className="font-bold text-xs mt-auto">{ formatNumber(priceSTA) }</span>
                    </div>
                </div>
            </div>
            <hr className="opacity-25 mt-auto" />
            <div className="h-16 flex flex-row items-center p-2 space-x-2">
                <span className="font-thin text-base opacity-50">%APY</span>
                <div className="flex-1 flex flex-row justify-around">
                    { Object.entries(apy).map(([label, value]) => (
                        <div className="flex flex-col items-center" key={label}>
                            <span className="font-thin opacity-50">{ label }</span>
                            <span className="">{ formatNumber(value as number, 2) }</span>
                        </div>
                    )) }
                </div>
            </div>
        </div>
    )
}

export default AllPoolsCard