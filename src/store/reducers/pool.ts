import { STA_TOTAL_SUPPLY } from '../../Constants/Constants'
import Big from 'big.js'
import { DateTime } from 'luxon'
import { POOLS } from '../../Constants/Constants'
import _ from 'lodash'

const INITIAL_STATE = {
  name: null,
  contractAddress: null,
  assets: null,
  data: {
    price: {
      current: null,
      previous: null,
      change: null,
      changePerc: null,
    },
    chart: {
      volume: null,
      liquidity: null,
      feeReturns: null,
    },
    apy: {
      period1: 0.02,
      period7: 0.06,
      period30: 0.09,
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

		case 'SET_POOL': {
      const contractAddress = action.payload.contractAddress
      let name
      let assets
      _.mapValues(POOLS, (item, key) => {
        if (item.contractAddress === contractAddress) {
          name = item.name
          assets = item.assets
        }
      })

      if (name) {
        return Object.assign({}, INITIAL_STATE, {
          name,
          assets,
          contractAddress: contractAddress,
        })
      } else {
        return Object.assign({}, INITIAL_STATE, {
          meta: {
            error: true,
            errorMessage: `No pool found for contract address: ${contractAddress}`
          },
        })
      }
    }

    case 'RESET_POOL': {
			return INITIAL_STATE
    }

		case 'POOL_LOADING': {
			return {
        ...state,
        meta: _.merge({}, INITIAL_STATE.meta, {
          loading: true,
        })
      }
    }

    case 'POOL_SUCCESS': {
      const _results = action.payload
      console.log('POOL_SUCCESS: ', _results);
      // const priceVolumeStaResult = _results.find((result:any) => result.name === 'price:sta').result
      // const priceWStaResult = _results.find((result:any) => result.name === 'price:wsta').result
      // const supplyStaResult = _results.find((result:any) => result.name === 'supply:sta').result
      // const supplyWStaResult = _results.find((result:any) => result.name === 'supply:wsta').result

      const chartResult = _results.find((result:any) => result.name === 'chart').result
      console.log('chartResult: ', chartResult);

      // // Convert Supply from 18dp string to BigInt
      // let rawRemainingStaSupply = supplyStaResult.split('')
      // rawRemainingStaSupply.splice(-18, 0, '.')
      // const remainingSta = Big(rawRemainingStaSupply.join(''))

      // let rawRemainingWStaSupply = supplyWStaResult.split('')
      // rawRemainingWStaSupply.splice(-18, 0, '.')
      // const remainingWSta = Big(rawRemainingWStaSupply.join(''))


			return {
        ...state,
        data: {
          chart: {
            volume: chartResult.volume,
            liquidity: chartResult.liquidity,
            feeReturns: chartResult.feeReturns,
          },
        },
        meta: _.merge({}, INITIAL_STATE.meta, {
          success: true,
        })
      }
    }

    case 'POOL_ERROR': {
			return {
        ...state,
        data: INITIAL_STATE.data,
        meta: _.merge({}, INITIAL_STATE.meta, {
          error: true,
        })
      }
    }

		default: {
			return state
    }
	}
}
