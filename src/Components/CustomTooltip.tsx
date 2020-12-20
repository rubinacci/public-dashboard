import { formatNumber } from "../util/formatNumber"

const CustomTooltip = ({ series, seriesIndex, dataPointIndex, w, background, format = false, showTimestampDate = true }: any) => (
    `<div class="flex flex-col font-bold text-gray-800 p-1 ${background || ""}">
        ${ showTimestampDate ? (() => {
            const date = new Date(w.config.series[seriesIndex].data[dataPointIndex].x * 1000)
            return `<span class="text-gray-600">${ date.toLocaleDateString() }</span>`
        })() : "" }
        <span>$${ (format ? formatNumber : (i: any) => i)(series[seriesIndex][dataPointIndex] || "0") }</span>
    </div>`
)

export default CustomTooltip