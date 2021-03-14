import { STA_TOTAL_SUPPLY } from '../../Constants/Constants'
import Big from 'big.js'
import { DateTime } from "luxon";

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
  exchangeRate: {
    staToWSta: null,
    wStaToSta: null,
  },
  volume: {
    inCurrency: null,
    inSta: null,
  },
  supply: {
    remainingSta: null,
    total: null,
    remainingWSta: null,
  },
  burn24h: null,
  wrappedSupply: null,
  chart: {
    price: null,
    volume: null,
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

      // Convert Supply from 18dp string to BigInt
      let rawRemainingStaSupply = supplyStaResult.split('')
      rawRemainingStaSupply.splice(-18, 0, '.')
      const remainingSta = Big(rawRemainingStaSupply.join(''))

      let rawRemainingWStaSupply = supplyWStaResult.split('')
      rawRemainingWStaSupply.splice(-18, 0, '.')
      const remainingWSta = Big(rawRemainingWStaSupply.join(''))

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
        exchangeRate: {
          staToWSta: priceVolumeStaResult.currentPrice / priceWStaResult.currentPrice,
          wStaToSta: priceWStaResult.currentPrice / priceVolumeStaResult.currentPrice,
        },
        volume: {
          inCurrency: priceVolumeStaResult.volumeInCurrency,
          inSta: priceVolumeStaResult.volumeInSta,
        },
        supply: {
          remainingSta,
          remainingWSta,
          total: Big(STA_TOTAL_SUPPLY),
        },
        chart: {
          price: chartResult.price,
          volume: chartResult.volume,
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
