
import { Router } from "express";
import { AllCoins } from './constants';
import { Coingecko } from './coingecko';

export class APIRouter {

  router: any;
  coingecko: Coingecko;

  constructor() {
    this.router = Router();
    this.coingecko = Coingecko.getInstance();

    // Dummy service called by heroku process scheduler to prevent free dyno from sleeping
    this.router.get("/keepalive", (req, res) => {
      res.sendStatus(200);
    });

    this.router.get("/chartdata", async(req, res) => {
      const priceableCoins = AllCoins.filter((c) => c.coingeckoId !== null);

      let promises = [];

      let body = {};

      priceableCoins.forEach((coin) => {
        body[coin.name] = {};
        promises.push(this.coingecko.getMarketChartLastDay(coin.coingeckoId).then((r) => body[coin.name]['24'] = r));
        promises.push(this.coingecko.getMarketChartLast30Days(coin.coingeckoId).then((r) => body[coin.name]['30'] = r));
        promises.push(this.coingecko.getMarketChartLast365Days(coin.coingeckoId).then((r) => body[coin.name]['365'] = r));

      });
      await Promise.all(promises);
      res.json(body);
    });

    this.router.get("/stats", async (req, res) => {
      res.json({
        topData: {
          statera: {
            shares: "0.03%",
            staxeth: "200",
            sta: "9832190831.233",
            apy: {
              "24hr": "88.99%",
              "1w": "18%",
              "1m": "18.3%",
              "1y": "18.3%"
            }
          },
          delta: {
            shares: "0.03%",
            staxeth: "200",
            sta: "9832190831.233",
            apy: {
              "24hr": "88.99%",
              "1w": "18%",
              "1m": "18.3%",
              "1y": "18.3%"
            }
          },
          phoenix: {
            shares: "0.03%",
            staxeth: "200",
            sta: "9832190831.233",
            apy: {
              "24hr": "88.99%",
              "1w": "18%",
              "1m": "18.3%",
              "1y": "18.3%"
            }
          },
          all: {
            shares: "0.03%",
            staxeth: "200",
            sta: "9832190831.233",
            apy: {
              "24hr": "88.99%",
              "1w": "18%",
              "1m": "18.3%",
              "1y": "18.3%"
            }
          }
        }
      });
    });
  }
}