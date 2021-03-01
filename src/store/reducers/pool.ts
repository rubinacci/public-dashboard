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
      day1: null,
      day7: null,
      day30: null,
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
      const chartResult = _results.find((result:any) => result.name === 'chart').result

			return {
        ...state,
        data: {
          chart: {
            volume: chartResult.chart.volume,
            liquidity: chartResult.chart.liquidity,
            feeReturns: chartResult.chart.feeReturns,
          },
          apy: {
            day1: chartResult.apy.day1,
            day7: chartResult.apy.day7,
            day30: chartResult.apy.day30,
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
