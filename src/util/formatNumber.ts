export const formatNumber = (n: string | number) => {
    if (!n) return ""
    const s = typeof(n) === "string" ? n : n.toString()
    const split = s.split(".")
    const integer = split[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    const decimals = split[1]?.slice(0, 6)
    return decimals ? [integer, decimals].join(".") : integer
}