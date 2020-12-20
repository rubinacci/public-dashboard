import React from "react"
import ReactApexChart from "react-apexcharts"
import { Pool } from "../../Constants/Pool"
import CustomTooltip from "../CustomTooltip"
import DimensionsProvider from "../DimensionsProvider"

const PoolsRevenueCard = () => {



    return (
        <div className="flex-1 flex flex-col rounded-md shadow-sm text-white text-xs pb-2 border border-gray-400 border-opacity-25">
            <span className="text-gray-600 m-2 font-semibold">Pools Revenue</span>
            <DimensionsProvider className="w-full h-24 flex flex-row items-center justify-center mx-auto my-auto" render={({ width, height }) =>
                <ReactApexChart
                    type="donut"
                    width={width}
                    height={height}
                    series={[1, 2, 3]}
                    options={{
                        labels: Pool.values.map(p => p.name),
                        chart: { toolbar: { show: false }, sparkline: { enabled: false } },
                        dataLabels: { enabled: true },
                        yaxis: { show: false },
                        xaxis: { labels: { show: false } },
                        stroke: { curve: 'smooth' },              
                        floating: true,
                        axisTicks: { show: false },
                        axisBorder: { show: false },
                        legend: { position: "right" }   
                    }} />
                } />
        </div>
    )
}

export default PoolsRevenueCard