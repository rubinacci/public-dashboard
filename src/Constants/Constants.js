export const STA_TOTAL_SUPPLY = 101000000

export const STA_CONTRACT_ADDRESS = '0xa7DE087329BFcda5639247F96140f9DAbe3DeED1'
export const WSTA_CONTRACT_ADDRESS = '0xedeec5691f23e4914cf0183a4196bbeb30d027a0'

export const POOLS = {
  delta: {
    contractAddress: '0x59f96b8571e3b11f859a09eaf5a790a138fc64d0',
    name: 'Delta Liquidity Pool',
    isMulti: false,
    assets: [{
      // Statera
      contractAddress: '0xa7DE087329BFcda5639247F96140f9DAbe3DeED1',
      proportion: 0.5,
    }, {
      // Ethereum
      contractAddress: '0x64ff637fb478863b7468bc97d30a5bf3a428a1fd',
      proportion: 0.5,
    }],
  },
  infinity: {
    contractAddress: '0xa94700c1a1ae21324e78d5bdf6b2924e45a6068f',
    name: 'Infinity Liquidity Pool',
    isMulti: false,
    assets: [{
      // Statera
      contractAddress: '0xa7DE087329BFcda5639247F96140f9DAbe3DeED1',
      proportion: 0.5,
    }, {
      // Wrapped Statera
      contractAddress: '0xeDEec5691f23E4914cF0183A4196bBEb30d027a0',
      proportion: 0.5,
    }],
  },
  titan: {
    contractAddress: '0x55353cbadda8fd525f0e6f307b3527d518416700',
    name: 'Titan Index Pool',
    isMulti: true,
    assets: [{
      // Wrapped Statera
      contractAddress: '0xeDEec5691f23E4914cF0183A4196bBEb30d027a0',
      proportion: 0.5,
    }, {
      // Wrapped Bitcoin
      contractAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      proportion: 0.125,
    }, {
      // Wrapped Ethereum
      contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      proportion: 0.125,
    }, {
      // Chainlink
      contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
      proportion: 0.125,
    }, {
      // Synthetix
      contractAddress: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
      proportion: 0.125,
    }],
  },
  highRisk: {
    contractAddress: '0xe6cb1c3a212001d02706ef93ea0a87b35b36d016',
    name: 'High-Risk Pool',
    isMulti: true,
    assets: [{
      // Wrapped Statera
      contractAddress: '0xeDEec5691f23E4914cF0183A4196bBEb30d027a0',
      proportion: 0.5,
    }, {
      // yearn.finance
      contractAddress: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
      proportion: 0.1188,
    }, {
      // Uniswap
      contractAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      proportion: 0.1188,
    }, {
      // Aave
      contractAddress: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      proportion: 0.1188,
    }, {
      // Wrapped Ethereum
      contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      proportion: 0.1188,
    }, {
      // Foundry
      contractAddress: '0x6c972b70c533e2e045f333ee28b9ffb8d717be69',
      proportion: 0.025,
    }],
  },
  lowRisk: {
    contractAddress: '0x5353e4294fcf069a5e8db9b8109d8f23dcd25f35',
    name: 'Low-Risk Pool',
    isMulti: true,
    assets: [{
      // Wrapped Statera
      contractAddress: '0xeDEec5691f23E4914cF0183A4196bBEb30d027a0',
      proportion: 0.5,
    }, {
      // Dai
      contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
      proportion: 0.0225,
    }, {
      // USD Coin
      contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      proportion: 0.0225,
    }, {
      // Wrapped Ethereum
      contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      proportion: 0.05,
    }],
  },
}

export const ASSETS = [
  {
    name: 'Statera',
    ticker: 'STA',
    contractAddress: '0xa7DE087329BFcda5639247F96140f9DAbe3DeED1',
  },
  {
    name: 'Wrapped Statera',
    ticker: 'wSTA',
    contractAddress: '0xeDEec5691f23E4914cF0183A4196bBEb30d027a0',
  },
  {
    name: 'Ethereum',
    ticker: 'ETH',
    contractAddress: '0x64ff637fb478863b7468bc97d30a5bf3a428a1fd',
  },
  {
    name: 'Wrapped Ethereum',
    ticker: 'wETH',
    contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  {
    name: 'Wrapped Bitcoin',
    ticker: 'wBTC',
    contractAddress: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  },
  {
    name: 'Chainlink',
    ticker: 'LINK',
    contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
  },
  {
    name: 'Synthetix',
    ticker: 'SNX',
    contractAddress: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
  },
  {
    name: 'yearn.finance',
    ticker: 'YFI',
    contractAddress: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
  },
  {
    name: 'Uniswap',
    ticker: 'UNI',
    contractAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  },
  {
    name: 'Aave',
    ticker: 'AAVE',
    contractAddress: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  },
  {
    name: 'Foundry',
    ticker: 'FRY',
    contractAddress: '0x6c972b70c533e2e045f333ee28b9ffb8d717be69',
  },
  {
    name: 'Dai',
    ticker: 'DAI',
    contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  {
    name: 'USD Coin',
    ticker: 'USDC',
    contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
]


export const CONTRACTABI =[{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_rewardsDistribution","type":"address"},{"internalType":"address","name":"_rewardsToken","type":"address"},{"internalType":"address","name":"_stakingToken","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":false,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerNominated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"isPaused","type":"bool"}],"name":"PauseChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Recovered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"}],"name":"RewardPaid","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newDuration","type":"uint256"}],"name":"RewardsDurationUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdrawn","type":"event"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimRemainingTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"earned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"useraddress","type":"address"}],"name":"getDEATHBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getRewardForDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"useraddress","type":"address"}],"name":"getUNIV2Balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastPauseTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastTimeRewardApplicable","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastUpdateTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"nominateNewOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"nominatedOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"reward","type":"uint256"}],"name":"notifyRewardAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"periodFinish","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"}],"name":"recoverERC20","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerTokenStored","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"rewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardsDistribution","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardsDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardsToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bool","name":"_paused","type":"bool"}],"name":"setPaused","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_rewardsDistribution","type":"address"}],"name":"setRewardsDistribution","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_rewardsDuration","type":"uint256"}],"name":"setRewardsDuration","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"stake","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"stakingToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userRewardPerTokenPaid","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

export const CONTRACTADDRESS = "0x1f0bc17c83ed9cdf85d186fdef3ba9fe1fb25da6"

export const UNISWAPAPPROVE = "0x7e34280daf41a625ae9d8b977e10c6fe84018381"

export const UNISWAPABI = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"_reserve0","type":"uint112"},{"internalType":"uint112","name":"_reserve1","type":"uint112"},{"internalType":"uint32","name":"_blockTimestampLast","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_token0","type":"address"},{"internalType":"address","name":"_token1","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sync","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]

export const UNIPOOL = "www.pooldirection.com"

export const DEATHPOOL = "www.pooldirection.com"

export const TELEGRAM = "https://t.me/purgatorynumber9"
