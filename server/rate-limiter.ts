
import { Logger } from './logger';

const kLoggerCategory = 'RATELIMITER';

export class RateLimiter {

  private maximumRequests: number;
  private timespan: number;
  private name: string;
  private hits: Date[];

  constructor(maximumRequests: number, timespan: number, name: string) {
    this.maximumRequests = maximumRequests;
    this.timespan = timespan;
    this.hits = [];
    this.name = name;
  }

  private purge() {
    const now = new Date().getTime();
    const date = new Date(now - this.timespan);
    this.hits = this.hits.filter((hitDate) => {
      return hitDate.getTime() > date.getTime();
    });
  }

  private wait(ms: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    })
  }

  public async rateLimit<T>(fn: () => T): Promise<T> {
    this.purge();
    if (this.hits.length < this.maximumRequests) {
      this.hits.push(new Date());
      return fn();
    }
    else {
      const oldestHit = this.hits[0].getTime();
      const now = new Date().getTime();
      const delay = this.timespan - (now - oldestHit);
      Logger.log(kLoggerCategory, `Rate limiting ${this.name} for ${delay}ms`);
      // Wait until the oldest request is out the equation
      await this.wait(delay);
      return this.rateLimit(fn);
    }
  }
}