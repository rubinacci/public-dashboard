import { formatNumber } from "../util/formatNumber"

const CustomTooltip = ({ series, seriesIndex, dataPointIndex, w, background, format = false }: any) => (
    `<div class="font-bold text-gray-800 p-1 ${background || ""}"><span>$${ (format ? formatNumber : (i: any) => i)(series[seriesIndex][dataPointIndex] || "0") }</span></div>`
)

export default CustomTooltip