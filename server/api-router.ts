
import { Router } from "express";
import { AllCoins, Contracts } from './constants';
import { Coingecko } from './coingecko';
import { Bloxy } from './bloxy';

import ExpressJoi from 'express-joi-validator';
const Joi = require('@hapi/joi');

export class APIRouter {

  router: any;
  coingecko: Coingecko;
  bloxy: Bloxy;

  constructor() {
    this.router = Router();
    this.coingecko = Coingecko.getInstance();
    this.bloxy = Bloxy.getInstance();

    // Dummy service called by heroku process scheduler to prevent free dyno from sleeping
    this.router.get("/keepalive", (req, res) => {
      res.sendStatus(200);
    });
/*
    const customJoi = Joi.extend((joi: any) => {
      return {
        name: 'stringArray',
        base: joi.array().items(joi.string()).meta({ baseType: 'array' }),
        coerce(value: any, helpers: any) {
          if (typeof value !== 'string') {
            return { value: value };
          }
          if (!value) {
            return [];
          }
          return value.replace(/^,+|,+$/mg, '').split(',');
        }
      };
    });

    const schema = Joi.object().keys({
      coins: customJoi.stringArray().items(Joi.string())
    });
*/
    this.router.get("/chartdata", async(req, res) => {
      const coinNames = req.query.coins ? req.query.coins.split(',') :  AllCoins.map((c) => c.name);
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

    this.router.get("/statera/top_holders", async (req, res) => {
      const r = await this.bloxy.getHolders(Contracts.statera);
      res.json(r);
    });
    this.router.get("/delta/top_holders", async (req, res) => {
      const r = await this.bloxy.getHolders(Contracts.delta);
      res.json(r);
    });
    this.router.get("/bpt/top_holders", async (req, res) => {
      const r = await this.bloxy.getHolders(Contracts.bpt);
      res.json(r);
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