import React, { FunctionComponent, useState } from "react"
import classnames from "classnames"

import ReactApexChart from "react-apexcharts"
import { Pool } from "../../Constants/Pool"
import DimensionsProvider from "../DimensionsProvider"
import CustomTooltip from "../CustomTooltip"
import { useChartData } from "../../hooks/useETHPrice"
import { formatNumber } from "../../util/formatNumber"

const PoolVolumeCard: FunctionComponent<{ pool: Pool | null }> = ({ pool }) => {

    const timePeriods = { "24": "Day", "30": "Month", "365": "Year" }
    const [timePeriod, setTimePeriod] = useState<string>(Object.keys(timePeriods)[0])

    const poolData = useChartData()
    const chartData: [number, number][] = ((poolData || {})[parseInt(timePeriod)] || {})["total_volumes"] || []
    const volumeData = chartData.map(([timestamp, value]: [number, number]) => ({ x: timestamp, y: value }))

    return (
        <div className="flex-1 flex flex-col rounded-md shadow-sm text-white text-xs pb-2 border border-gray-400 border-opacity-25">
            <div className="flex flex-row justify-between items-center">
                <span className="text-gray-500 m-2 font-semibold">Pool{ pool === null ? "s" : "" } volume</span>
                <span className="text-gray-500 font-bold mr-2">Last: { formatNumber(volumeData[volumeData.length - 1]?.y.toString()) }</span>
            </div>
            <DimensionsProvider className="flex flex-row items-center justify-center my-auto mb-2 h-24" render={({ width, height}) =>
                <ReactApexChart
                    type="area"
                    height={height}
                    width={"100%"}
                    series={[{ data: volumeData }]}
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
            <div className="flex flex-row self-center border-l border-r border-gray-500 border-opacity-25 rounded-sm overflow-hidden">
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

export default PoolVolumeCard