const INITIAL_STATE = {
  swapRatios: {
    staToWSta: null,
    wStaToSta: null,
  },
  price: {
    current: null,
    previous: null,
    meta: {
      success: false,
      loading: false,
      error: false,
      errorMessage: null,
    },
  },
  volume: {},
  stats: {
    remainingSupply: null,
    burn: null,
    wrappedSupply: null,
  },
  chart: {
    data: null,
    meta: {
      success: false,
      loading: false,
      error: false,
      errorMessage: null,
    },
  },
  meta: {
    success: false,
    loading: false,
    error: false,
    errorMessage: null,
  },
}

export default (state = INITIAL_STATE, action:any) => {
	switch (action.type) {

		case 'PRICE_LOADING': {
			return Object.assign({}, state, {
        price: {
          current: null,
          previous: null,
          meta: {
            success: false,
            loading: true,
            error: false,
            errorMessage: null,
          }
        },
      })
    }

    case 'PRICE_SUCCESS': {
      const current = action.payload.market_data?.current_price?.usd
      const previous = action.payload.market_data?.price_change_24h_in_currency?.usd

			return Object.assign({}, state, {
        price: {
          current,
          previous,
          meta: {
            success: true,
            loading: false,
            error: false,
            errorMessage: null,
          }
        },
      })
    }

    case 'PRICE_ERROR': {
			return Object.assign({}, state, {
        price: {
          current: null,
          previous: null,
          meta: {
            success: false,
            loading: false,
            error: true,
            errorMessage: null,
          }
        },
      })
    }

		default: {
			return state
    }
	}
}
