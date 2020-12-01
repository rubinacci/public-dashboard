export class Pool {

    public id: string
    public name: string
    public symbol: string
    public image: string
    public address: string
    public pairAddress: string

    static values: Pool[] = []

    static decimals = 18

    static STATERA = new Pool("statera", "Statera", "STA", require("../assets/images/pools/statera.png"), "0xa7de087329bfcda5639247f96140f9dabe3deed1", "0x59f96b8571e3b11f859a09eaf5a790a138fc64d0")
    static DELTA = new Pool("delta", "Delta", "DELTA", require("../assets/images/pools/delta.png"), "0x59f96b8571e3b11f859a09eaf5a790a138fc64d0", "0x542bca1257c734d58fbea2edbb8f2f3a01eb306d")
    static PHOENIX = new Pool("phoenix", "Phoenix Fund", "PBPT", require("../assets/images/pools/phoenix.png"), "0xcd461b73d5fc8ea1d69a600f44618bdfac98364d", "0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D")

    private constructor(id: string, name: string, symbol: string, image: string, address: string, pairAddress: string) {
        this.id = id
        this.name = name
        this.symbol = symbol
        this.image = image
        this.address = address
        this.pairAddress = pairAddress
        Pool.values.push(this)
    }
}