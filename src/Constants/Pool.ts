export class Pool {

    public id: string
    public name: string
    public symbol: string
    public image: string

    static STATERA = new Pool("statera", "Statera", "STA", require("../assets/images/pools/statera.png"))
    static DELTA = new Pool("delta", "Delta", "DELTA", require("../assets/images/pools/delta.png"))
    static PHOENIX = new Pool("phoenix", "Phoenix Fund", "PBPT", require("../assets/images/pools/phoenix.png"))

    private constructor(id: string, name: string, symbol: string, image: string) {
        this.id = id
        this.name = name
        this.symbol = symbol
        this.image = image
    }
}