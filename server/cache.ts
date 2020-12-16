
import { Logger } from './logger';

const kLoggerCategory = 'CACHE';

export class Cache {

  private static instance: Cache;
  private cache: any = {};

  private constructor() { }

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public set(key: string, value: any, ttl: number) {
    this.cache[key] = {
      value: value,
      expirationDate: new Date(new Date().getTime() + ttl)
    };
  }

  public get(key: string): any {
    const entry = this.cache[key];
    if (entry && entry.expirationDate.getTime() > new Date().getTime()) {
      Logger.log(kLoggerCategory, `cache hit for ${key}`);
      return entry.value;
    }
    Logger.log(kLoggerCategory, `cache miss for ${key}`);
    return null;
  }

  public cachedValueOrClosure(key: string, fn: () => any, ttl: number): any {
    let value = this.get(key);
    if (!value) {
      value = fn();
      this.set(key, value, ttl);
    }
    return value;
  }

  public cachedValueOrClosureAsync = async (key: string, fn: () => Promise<any>, ttl: number) => {
    let value = this.get(key)
    if (!value) {
      value = await fn()
      this.set(key, value, ttl)
    }
    return value
  }
}