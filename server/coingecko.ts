
const CoinGecko = require('coingecko-api');
const moment = require('moment');
const CoinGeckoClient = new CoinGecko();

import { RateLimiter } from './rate-limiter';
import { Cache } from './cache';

export class Coingecko {

  private static instance: Coingecko;

  static getInstance(): Coingecko {
    if (!Coingecko.instance) {
      Coingecko.instance = new Coingecko();
    }
    return Coingecko.instance;
  }

  /** Cache of promises */
  private cache: Cache;

  /** rate limiter for coingecko api */
  private rateLimiter: RateLimiter;

  private constructor() {
    this.cache = Cache.getInstance();
    this.rateLimiter = new RateLimiter(10, 1000);
  }

  private cacheKey(coingeckoId: string, type: string): string {
    return `${coingeckoId}_${type}`;
  }

  public async getHistoricPrices(coingeckoId: string, date: Date): Promise<any> {
    const r = await CoinGeckoClient.coins.fetchHistory(coingeckoId, {date: moment(date).format('DD-MM-YYYY'), localization: false});
    return r.data;
  }

  public async getCurrentPrices(coingeckoIds: string[]): Promise<any> {
    const cacheKey = coingeckoIds.sort().reduce((acc, value) => {
      return `${acc}_${value}`;
    });
    return this.cache.cachedValueOrClosure(cacheKey, () => {
      return CoinGeckoClient.simple.price({ ids: coingeckoIds, vs_currencies: ['usd', 'eth', 'btc']});
    }, 60 * 1000);
  }

  private async getMarketChart(coingeckoId: string, days: number): Promise<any> {
    return this.rateLimiter.rateLimit<any>(async () => {
      const response = await CoinGeckoClient.coins.fetchMarketChart(coingeckoId, { vs_currency: 'usd', days: days });
      return response.data;
    });
  }

  public async getMarketChartLastDay(coingeckoId: string): Promise<any> {
    const cacheKey = this.cacheKey(coingeckoId, 'chart1');
    return this.cache.cachedValueOrClosure(cacheKey, () => {
      return this.getMarketChart(coingeckoId, 1);
    }, 60 * 1000);
  }

  public async getMarketChartLast30Days(coingeckoId: string): Promise<any> {
    const cacheKey = this.cacheKey(coingeckoId, 'chart30');
    return this.cache.cachedValueOrClosure(cacheKey, () => {
      return this.getMarketChart(coingeckoId, 30);
    }, 60 * 60 * 1000);
  }

  public async getMarketChartLast365Days(coingeckoId: string): Promise<any> {
    const cacheKey = this.cacheKey(coingeckoId, 'chart365');
    return this.cache.cachedValueOrClosure(cacheKey, () => {
      return this.getMarketChart(coingeckoId, 365);
    }, 60 * 60 * 1000);
  }
}