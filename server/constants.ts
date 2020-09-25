
import { Coin } from './model/coin';

enum Contracts {
    statera = '0xa7DE087329BFcda5639247F96140f9DAbe3DeED1',
    wbtc = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    weth = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    
    link = '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    snx = '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    delta = '0x59F96b8571E3B11f859A09Eaf5a790A138FC64D0',
    //bpt = '0xcd461B73D5FC8eA1D69A600f44618BDFaC98364D'
};

const AllContracts = Object.keys(Contracts).map((x) => Contracts[x]);

const STATERA = new Coin('statera', 'STA', Contracts.statera, 'statera');
const WBTC = new Coin('wBTC', 'BTC', Contracts.wbtc, 'bitcoin');
const WETH = new Coin('wETH', 'ETH', Contracts.weth, 'ethereum');
const LINK = new Coin('link', 'LINK', Contracts.link, 'chainlink');
const SNX = new Coin('link', 'SNX', Contracts.snx, 'havven');
const DELTA = new Coin('delta', 'UNI-V2', Contracts.delta, null);

const AllCoins = [STATERA, WBTC, WETH, LINK, SNX, DELTA];

export { Contracts, AllContracts, STATERA, WBTC, WETH, LINK, SNX, DELTA, AllCoins };
