import React, { FunctionComponent, useState } from "react"
import classnames from "classnames"

import ReactApexChart from "react-apexcharts"
import { Pool } from "../../Constants/Pool"
import DimensionsProvider from "../DimensionsProvider"
import CustomTooltip from "../CustomTooltip"
import { useChartData, useFormattedChartData } from "../../hooks/useGlobalState"
import { formatNumber } from "../../util/formatNumber"

const PoolPriceCard: FunctionComponent<{ pool: Pool }> = ({ pool }) => {

    const data = useChartData("price", pool)

    const timePeriods = Object.keys(data).sort()
    const [timePeriodIndex, setTimePeriodIndex] = useState<number>(0)

    const allPrices = useFormattedChartData("price", pool, timePeriods[0])
    const lastPrice = allPrices[allPrices.length - 1]
    const formattedData = useFormattedChartData("price", pool, timePeriods[timePeriodIndex])

    return (
        <div className="flex-1 flex flex-col rounded-md shadow-sm text-white text-xs pb-2 border border-gray-400 border-opacity-25">
            <div className="flex flex-row justify-between items-center">
                <span className="text-gray-600 m-2 font-semibold">Token price</span>
                <span className="text-gray-600 font-bold mr-2">Last: ${ formatNumber(lastPrice?.y.toString()) }</span>
            </div>
            <DimensionsProvider className="flex flex-row h-20 w-full items-center justify-center mb-2 mt-auto" render={({ width, height }) =>
                <ReactApexChart
                    type="area"
                    width={width}
                    height={height}
                    series={[{ data: formattedData }]}
                    options={{
                        chart: { toolbar: { show: false }, sparkline: { enabled: true } },
                        dataLabels: { enabled: false },
                        yaxis: { show: false },
                        xaxis: { labels: { show: false } },
                        stroke: { curve: 'smooth' },              
                        floating: true,
                        axisTicks: { show: false },
                        axisBorder: { show: false },
                        labels: { show: false },
                        legend: { show: false },
                        tooltip: { custom: (e: any) => CustomTooltip({ ...e, format: true }) }        
                    }} />
                } />
            <div className="flex flex-row mt-auto self-center border-l border-r border-gray-500 border-opacity-25 rounded-sm overflow-hidden">
                { timePeriods.map((label, i) => (
                    <button
                        key={i}
                        className={classnames(
                            "relative py-1 w-12",
                            "border border-gray-500 border-opacity-25 font-semibold",
                            "text-gray-900",
                            i === 0 && "rounded-l-sm",
                            i === Object.entries(timePeriods).length - 1 && "rounded-r-sm",
                            "overflow-hidden"
                        )}
                        style={{ fontSize: "0.6rem" }}
                        onClick={() => setTimePeriodIndex(i)}>
                        { label }
                        { timePeriodIndex === i ? (
                            <div className="absolute w-full bg-blue-500 bottom-0 left-0" style={{ height: "0.1rem" }} />
                        ) : null }
                    </button>
                )) }
            </div>
        </div>
    )
}

export default PoolPriceCard