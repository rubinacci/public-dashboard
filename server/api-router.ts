
import { Router } from "express";
import { AllCoins, Contracts } from './constants';
import { Coingecko } from './coingecko';
import { Bloxy } from './bloxy';

import { StatsProvider } from "./StatsProvider";
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
    this.router.get("/chartdata", async (req, res) => {
      res.json(await StatsProvider.fetchChartData())
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
      res.json(await StatsProvider.fetchStats())
      /*res.json({
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
      });*/
    });
  }
}