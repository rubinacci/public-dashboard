import React, { FunctionComponent, useState } from "react"
import classnames from "classnames"

import ReactApexChart from "react-apexcharts"
import { Pool } from "../../Constants/Pool"
import DimensionsProvider from "../DimensionsProvider"
import CustomTooltip from "../CustomTooltip"
import { useChartData } from "../../hooks/useETHPrice"

const PoolPriceCard: FunctionComponent<{ pool: Pool }> = ({ pool }) => {

    const timePeriods = { "24": "Day", "30": "Month", "365": "Year" }
    const [timePeriod, setTimePeriod] = useState<string>(Object.keys(timePeriods)[0])

    const poolData = useChartData()
    const chartData: [number, number][] = ((poolData || {})[parseInt(timePeriod)] || {})["prices"] || []
    const priceData = chartData.map(([timestamp, value]: [number, number]) => ({ x: timestamp, y: value }))

    return (
        <div className="flex-1 flex flex-col rounded-md shadow-sm text-white text-xs pb-2 border border-gray-400 border-opacity-25">
            <span className="text-gray-500 m-2 font-semibold">Pool price</span>
            <DimensionsProvider className="flex flex-row h-20 w-full items-center justify-center mb-2 mt-auto" render={({ width, height }) =>
                <ReactApexChart
                    type="area"
                    width={width}
                    height={height}
                    series={[{ data: priceData }]}
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
                        tooltip: { custom: CustomTooltip }        
                    }} />
                } />
            <div className="flex flex-row mt-auto self-center border-l border-r border-gray-500 border-opacity-25 rounded-sm overflow-hidden">
                { Object.entries(timePeriods).map(([_timePeriod, label], i) => (
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
                        onClick={() => setTimePeriod(_timePeriod)}>
                        { label }
                        { timePeriod === _timePeriod ? (
                            <div className="absolute w-full bg-blue-500 bottom-0 left-0" style={{ height: "0.1rem" }} />
                        ) : null }
                    </button>
                )) }
            </div>
        </div>
    )
}

export default PoolPriceCard