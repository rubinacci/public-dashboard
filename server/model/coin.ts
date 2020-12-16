
class Coin {

  name: string;
  symbol: string;
  contract: string;
  coingeckoId: string;
  fetchPrices: () => Promise<Record<string, any[]>>
  fetchVolumes: () => Promise<Record<string, any[]>>
  fetchStats: () => Promise<Record<string, any[]>>

  constructor(name: string, symbol: string, contract: string, coingeckoId: string, fetchPrices: () => Promise<Record<string, any[]>>, fetchVolumes: () => Promise<Record<string, any[]>>, fetchStats: () => Promise<Record<string, any[]>>) {
    this.name = name;
    this.symbol = symbol;
    this.contract = contract;
    this.coingeckoId = coingeckoId;
    this.fetchPrices = fetchPrices;
    this.fetchVolumes = fetchVolumes;
    this.fetchStats = fetchStats;
  }
}

export { Coin };