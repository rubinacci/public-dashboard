
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
import { AllCoins } from './constants';

const app = express();
const eth = new Eth(process.env.INFURA_KEY);

app.use(compression());

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
/*  const coingecko = new Coingecko();
  const uniswap = new Uniswap(eth.web3);
  await uniswap.setup();

  const response = await coingecko.getCurrentPrices(AllCoins.map((c) => c.coingeckoId));
  console.log(response);*/
})();


