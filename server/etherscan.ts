
import { Cache } from './cache';
import { RateLimiter } from './rate-limiter';
import axios from 'axios';

class Etherscan {

  /** Cache of promises */
  private cache: Cache;

  /** rate limiter for coingecko api */
  private rateLimiter: RateLimiter;
  private api: any;

  private baseURL: string = 'https://api.etherscan.io/';//?module=stats&action=tokensupply&contractaddress=0xa7DE087329BFcda5639247F96140f9DAbe3DeED1&apikey=YourApiKeyToken;

  private static instance: Etherscan;

  static getInstance(): Etherscan {
    if (!Etherscan.instance) {
      Etherscan.instance = new Etherscan();
    }
    return Etherscan.instance;
  }

  private constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      responseType: 'json',
    });
  }
/*
  public getSupply(contract: string): Promise<number> {
    return this.api.request<ResultsItemModel[]>({ method: 'get', url: '/api', params: { module: name, zip_code: zipCode }}).then((result) => {
      let results = result.data.map((x) => new ResultsItemModel(x))
      results.sort((a, b) => a.price.amount < b.price.amount ? -1 : a.price.amount > b.price.amount ? 1 : 0)
      if (results.length > 0) {
        results[0].bestDeal = true;
      }
      return results;
    })
  }*/
}