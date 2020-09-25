
class Coin {

  name: string;
  symbol: string;
  contract: string;
  coingeckoId: string;

  constructor(name: string, symbol: string, contract: string, coingeckoId: string) {
    this.name = name;
    this.symbol = symbol;
    this.contract = contract;
    this.coingeckoId = coingeckoId;
  }
}

export { Coin };