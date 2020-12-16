export type Timeframe = "24h" | "30d" | "all" | "daily"

export const getTimeframeOptions = (timeframe: Timeframe) => {
    const N_DATA_POINTS = 50
    const endTime = Math.floor(Date.now() / 1000)
    const startTime = (() => {
        switch (timeframe) {
            case "24h": return endTime - 60 * 60 * 24
            case "30d": return endTime - 60 * 60 * 24 * 30
            case "all": return 1594771200 // 15 Jul 2020
        }
    })()
    return [startTime, Math.floor((endTime - startTime) / N_DATA_POINTS)]
}