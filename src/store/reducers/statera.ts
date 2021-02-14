import { STA_TOTAL_SUPPLY } from '../../Constants/Constants'

const INITIAL_STATE = {
  price: {
    sta: {
      current: null,
      previous: null,
      change: null,
      changePerc: null,
    },
    wsta: {
      current: null,
      previous: null,
      change: null,
      changePerc: null,
    },
  },
  swapRatios: {
    staToWSta: null,
    wStaToSta: null,
  },
  volume: {
    inCurrency: null,
    inSta: null,
  },
  supply: {
    current: null,
    total: STA_TOTAL_SUPPLY,
    wsta: null,
  },
  burn24h: null,
  wrappedSupply: null,
  chart: {
    price: null,
    volumne: null,
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

		case 'STATERA_LOADING': {
			return Object.assign({}, INITIAL_STATE, {
        meta: {
          loading: true,
        }
      })
    }

    case 'STATERA_SUCCESS': {
      const _results = action.payload
      const priceVolumeStaResult = _results.find((result:any) => result.name === 'price:sta').result
      const priceWStaResult = _results.find((result:any) => result.name === 'price:wsta').result
      const supplyStaResult = _results.find((result:any) => result.name === 'supply:sta').result
      const supplyWStaResult = _results.find((result:any) => result.name === 'supply:wsta').result
      const chartResult = _results.find((result:any) => result.name === 'chart').result

			return Object.assign({}, INITIAL_STATE, {
        price: {
          sta: {
            current: priceVolumeStaResult.currentPrice,
            previous: priceVolumeStaResult.previousPrice,
            change: priceVolumeStaResult.priceChange,
            changePerc: priceVolumeStaResult.priceChangePerc,
          },
          wsta: {
            current: priceWStaResult.currentPrice,
            previous: priceWStaResult.previousPrice,
            change: priceWStaResult.priceChange,
            changePerc: priceWStaResult.priceChangePerc,
          },
        },
        volume: {
          inCurrency: priceVolumeStaResult.volumeInCurrency,
          inSta: priceVolumeStaResult.volumeInSta,
        },
        supply: {
          current: supplyStaResult,
          wsta: supplyWStaResult,
        },
        chart: {
          price: chartResult.price,
          volumne: chartResult.volume,
        },
        meta: {
          success: true,
        }
      })
    }

    case 'STATERA_ERROR': {
			return Object.assign({}, INITIAL_STATE, {
        meta: {
          error: true,
        }
      })
    }

		default: {
			return state
    }
	}
}
