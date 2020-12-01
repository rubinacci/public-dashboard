const CustomTooltip = ({ series, seriesIndex, dataPointIndex, w, background }: any) => (
    `<div class="font-bold text-gray-800 p-1 ${background || ""}"><span>${ series[seriesIndex][dataPointIndex] }</span></div>`
)

export default CustomTooltip