export const formatNumber = (n: string) => {
    if (!n) return ""
    const split = n.split(".")
    const integer = split[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    const decimals = split[1]
    return decimals ? [integer, decimals].join(".") : integer
}