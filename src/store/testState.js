const state = {
  statera: {
    // stateraPage state is dynamically generated when the user routes to /token/sta
    swapRatios: {
      staToWSta: 1.04,
      wStaToSta: 0.96,
    },
    price: {
      current: 0.01043,
      previous: 0.0087612,
    },
    volume: {

    },
    stats: {
      remainingSupply: 85142105,
      burn: 25012,
      wrappedSupply: 16231958,
    },
    chart: {
      data: [{
        label: "Liquidity",
        series: [{
          label: "7D",
          dataPoints: [{}],
        },{
          label: "30D",
          dataPoints: [{}],
        },{
          label: "1Y",
          dataPoints: [{}],
        }],
      },{
        label: "Volume",
        series: [], // as above
      }],
      meta: {
        success: false,
        loading: false,
        error: false,
        errorMessage: null,
      },
    },
    meta: {
      // UI hooks that reflect the state of async data requests
      success: false,
      loading: false,
      error: false,
      errorMessage: null,
    },
  },
  poolPage: {
    // same logic as for stateraPage, but the data displayed is slightly different, so we have different state
    name: "Delta",
    ticker: "?",
    contractAddress: "",
    price: {
      current: 0.01043,
      previous: 0.0087612,
    },
    chart: {
      // same as tokenPage, but includes Fee Returns data
    },
    assets: [{
      name: "Statera",
      ticker: "STA",
      proportion: 0.5,
    },{
      name: "Etherium",
      ticker: "ETH",
      proportion: 0.5,
    }],
    apy: [{
      label: "7D",
      value: 0.03,
    },{
      label: "30D",
      value: 0.09,
    },{
      label: "1Y",
      value: -0.1,
    }],
  },
  wallet: {
    // other connection details
    assets: [
      {
        name: "Statera",
        ticker: "STA",
        count: 50100,
        currentPrice: 5010,
      },
      // ...
    ],
    liquidity: [
      // ?
    ],
  },
}
