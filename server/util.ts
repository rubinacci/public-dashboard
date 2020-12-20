export type Timeframe = "24h" | "1w" | "30d" | "all" | "daily"

export const getTimeframeOptions = (timeframe: Timeframe) => {
    const N_DATA_POINTS = 50
    const endTime = Math.floor(Date.now() / 1000)
    const startTime = (() => {
        switch (timeframe) {
            case "24h":
            case "1w":
            case "30d":
                return endTime - getTimeframeInterval(timeframe)
            case "all": return 1594771200 // 15 Jul 2020
        }
    })()
    return [startTime, Math.floor((endTime - startTime) / N_DATA_POINTS)]
}

export const getTimeframeInterval = (timeframe: Timeframe) => {
    switch (timeframe) {
        case "24h": return 60 * 60 * 24
        case "1w":  return 60 * 60 * 24 * 7
        case "30d": return 60 * 60 * 24 * 30
    }
}

export const getTimeframeOptionsDays = (timeframe: Timeframe) => {
    switch (timeframe) {
        case "24h": return 1
        case "1w": return 7
        case "30d": return 30
    }
}