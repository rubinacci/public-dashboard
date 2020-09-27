//https://api.bloxy.info/token/token_holders_list?token=0x59F96b8571E3B11f859A09Eaf5a790A138FC64D0&key=ACCAF3LT6fEdd&format=table


import { Cache } from './cache';
import { RateLimiter } from './rate-limiter';
import axios from 'axios';

export class Bloxy {

  /** Cache of promises */
  private cache: Cache;

  /** rate limiter for coingecko api */
  private rateLimiter: RateLimiter;
  private api: any;

  private baseURL: string = 'https://api.bloxy.info';//?module=stats&action=tokensupply&contractaddress=0xa7DE087329BFcda5639247F96140f9DAbe3DeED1&apikey=YourApiKeyToken;

  private static instance: Bloxy;

  static getInstance(): Bloxy {
    if (!Bloxy.instance) {
      Bloxy.instance = new Bloxy();
    }
    return Bloxy.instance;
  }

  private constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      responseType: 'json',
    });
    this.cache = Cache.getInstance();
  }

  public getHolders(contract: string): Promise<any> {
    const cacheKey = `holders_${contract}`;
    return this.cache.cachedValueOrClosure(cacheKey, () => {
      return this.api.request({ method: 'get', url: '/token/token_holders_list', params: { token: contract, key: process.env.BLOXY_API_KEY }}).then((result) => {
        return result.data;
      });
    }, 5 * 60 * 1000);
  }
}