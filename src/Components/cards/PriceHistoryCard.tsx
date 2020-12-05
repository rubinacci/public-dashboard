import React, { FunctionComponent, useState } from "react"
import { Pool } from "../../Constants/Pool"
import { useApiResult } from "../../hooks/useApiResult"

import classnames from "classnames"
import ReactApexChart from "react-apexcharts"

import DimensionsProvider from "../DimensionsProvider"
import CustomTooltip from "../CustomTooltip"
import { formatNumber } from "../../util/formatNumber"

const timePeriods = ["24h", "1m", "3m", "1y"]

const PriceHistoryCard: FunctionComponent<{ pool: Pool }> = ({ pool }) => {

    const [period, setPeriod] = useState(timePeriods[0])
    const { data } = useApiResult(`https://api.coinstats.app/public/v1/charts?period=${period}&coinId=statera`, { chart: [] }, true)

    const chartData = (data.chart as any).map(([timestamp, value]: number[]) => ({ x: timestamp, y: value }))

    return (
        <div className="flex-1 flex flex-col rounded-md shadow-sm text-white text-xs pb-2 border border-gray-400 border-opacity-25">
            <div className="flex flex-row w-full justify-between pr-2">
                <span className="text-gray-500 m-2 font-semibold">Price History</span>
                <div className="flex flex-row space-x-2 items-center">
                    <div className="flex flex-row self-center border-l border-r border-gray-500 border-opacity-25 rounded-sm overflow-hidden">
                        { timePeriods.map((label, i) => (
                            <button
                                key={i}
                                className={classnames(
                                    "relative py-1 w-12",
                                    "border border-gray-500 border-opacity-25 font-semibold",
                                    "text-gray-900",
                                    i === 0 && "rounded-l-sm",
                                    i === timePeriods.length - 1 && "rounded-r-sm",
                                    "overflow-hidden"
                                )}
                                style={{ fontSize: "0.6rem" }}
                                onClick={() => setPeriod(label)}>
                                { label }
                                { label === period ? (
                                    <div className="absolute w-full bg-blue-500 bottom-0 left-0" style={{ height: "0.1rem" }} />
                                ) : null }
                            </button>
                        )) }
                    </div>
                    <span className="text-gray-500 font-bold">Last price: ${ formatNumber(chartData[chartData.length - 1]?.y.toString()) }</span>
                </div>
            </div>
            <DimensionsProvider className="w-full h-24 flex flex-row mt-auto -mb-2" render={({ width, height }) =>
                <ReactApexChart
                    type="area"
                    width={width}
                    height={height}
                    series={[{ data: chartData }]}
                    options={{
                        chart: { width: "100%", toolbar: { show: false }, sparkline: { enabled: true } },
                        dataLabels: { enabled: false },
                        yaxis: { show: false },
                        xaxis: { labels: { show: false } },
                        stroke: { curve: 'smooth', lineCap: "butt", width: 2 },              
                        floating: true,
                        axisTicks: { show: false },
                        axisBorder: { show: false },
                        labels: { show: false },
                        legend: { show: true },
                        tooltip: { custom: (e: any) => CustomTooltip({ ...e, format: true }) }  
                    }} />
                } />
        </div>
    )
}

export default PriceHistoryCard