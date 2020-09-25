import { ChainId, Token, TokenAmount, Pair, Route, Fetcher } from '@uniswap/sdk'
import { erc20ABI } from './erc20-abi';
import { Contracts, AllContracts } from './constants';

export class Uniswap {

  private symbolCache: any = {};
  private coinTokens: any = {};

  private ethDecimals = 18;
  private usdc = new Token(ChainId.MAINNET, 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6);
  private eth = new Token(ChainId.MAINNET, Contracts.weth, 18);
  private web3: any;

  constructor(web3: any) {
    this.web3 = web3;
  }

  async contractSymbol(address: string) {
    if (this.symbolCache[address] && this.symbolCache[address].tokenSymbol) {
      return this.symbolCache[address].tokenSymbol;
    }
    else {
      const tokenContract = new this.web3.eth.Contract(erc20ABI, address)
      const tokenSymbol = await tokenContract.methods.symbol().call();
      
      let cacheObject = this.symbolCache[address] || {};
      cacheObject.tokenSymbol = tokenSymbol;
      this.symbolCache[address] = cacheObject;
      return tokenSymbol;
    }
  }

  async contractDecimals(address: string) {
    if (this.symbolCache[address] && this.symbolCache[address].tokenDecimals) {
      return this.symbolCache[address].tokenDecimals;
    }
    else {
      const tokenContract = new this.web3.eth.Contract(erc20ABI, address)
      const tokenDecimals = await tokenContract.methods.decimals().call();
      let cacheObject = this.symbolCache[address] || {};
      cacheObject.tokenDecimals = tokenDecimals;
      this.symbolCache[address] = cacheObject;
      return tokenDecimals;
    }
  }

  async setup() {
    for (let coinIndex = 0; coinIndex < AllContracts.length; ++coinIndex) {
      const coin = AllContracts[coinIndex];
      console.log(coin);
      const coinDecimals = await this.contractDecimals(coin)
      const coinToken = new Token(ChainId.MAINNET, coin, coinDecimals);
      this.coinTokens[coin] = coinToken;
    }  
  }

  async getCoinPriceInUSDC(coin: string): Promise<string> {
    if (coin !== Contracts.weth) {
      const WETHUSDCPair = await Fetcher.fetchPairData(this.eth, this.usdc)
      const COINETHPair = await Fetcher.fetchPairData(this.coinTokens[coin], this.eth)

      const route = new Route([WETHUSDCPair, COINETHPair], this.usdc)

      return route.midPrice.invert().toSignificant(6);
    }
    else {
      const pair = await Fetcher.fetchPairData(this.coinTokens[coin], this.usdc)
      const route = new Route([pair], this.usdc)
      return route.midPrice.invert().toSignificant(6)
    }
  }

  async getCoinPriceInETH(coin): Promise<string> {
    const pair = await Fetcher.fetchPairData(this.coinTokens[coin], this.eth)
    const route = new Route([pair], this.eth)
    return route.midPrice.invert().toSignificant(6)
  }
}