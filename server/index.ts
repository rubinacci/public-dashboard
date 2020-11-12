
if (!process.env.HEROKU) {
  require('dotenv').config();
}

import compression from 'compression'
import express from 'express';
import * as path from 'path';
import { Eth } from './eth';
import { Coingecko } from './coingecko';
import { Uniswap } from './uniswap';
import { APIRouter } from './api-router';
import { AllCoins, Contracts } from './constants';
import { Logger } from './logger';
import { Bloxy } from './bloxy';
import cors from "cors"

const app = express();
const eth = new Eth(process.env.INFURA_KEY);

app.use(cors())
app.use(compression());

const kLoggerCategory = 'EXPRESS';

app.use((req, res, next) => {
  const start = Date.now();
  Logger.log(kLoggerCategory, `start request ${req.method} ${req.url}`);
  res.once('finish', () => {
    const t = Date.now() - start;

    Logger.log(kLoggerCategory, `finish request ${req.method} ${req.url} ${t}ms`);
    if (t >= (process.env.LOG_SLOW_REQUESTS_THRESHOLD || 5000)) {
      if (req.method == 'POST' || req.method == 'PUT') {
        Logger.log(kLoggerCategory, `slow request ${req.method} ${req.url} ${t}ms ${JSON.stringify(req.body)}`);
      }
      else {
        Logger.log(kLoggerCategory, `slow request ${req.method} ${req.url} ${t}ms`);
      }
    }
  });

  next();
});

// React site route
app.use(express.static(path.join(__dirname, '../', 'build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'build', 'index.html'));
});

app.use("/api", new APIRouter().router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});

(async () => {
  const bloxy = Bloxy.getInstance();
  const r = await bloxy.getHolders(Contracts.bpt);
  console.log(r);
/*  const coingecko = new Coingecko();
  const uniswap = new Uniswap(eth.web3);
  await uniswap.setup();

  const response = await coingecko.getCurrentPrices(AllCoins.map((c) => c.coingeckoId));
  console.log(response);*/
})();


