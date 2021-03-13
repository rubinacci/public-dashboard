import _ from 'lodash'
import { resolvePoolFromContractAddress } from '../../util/resolvePool'

const INITIAL_STATE = {
  name: null,
  contractAddress: null,
  assets: null,
  data: {
    assetValue: null,
    liquidity: null,
    volume: null,
    feesEarned: null,
    feesApy: null,
    liquidityProviderCount: null,
    totalBalancerLiquidity: null,
    balancerPrice: null,
    balReturns: null,
    feesAndBalReturns: null,
    chart: {
      assetPrice: null,
      volume: null,
      liquidity: null,
      feeReturns: null,
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

		case 'SET_MULTI_POOL': {
      const contractAddress = action.payload.contractAddress
      const { name, assets } = resolvePoolFromContractAddress(contractAddress)

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

    case 'RESET_MULTI_POOL': {
			return INITIAL_STATE
    }

		case 'MULTI_POOL_LOADING': {
			return {
        ...state,
        meta: _.merge({}, INITIAL_STATE.meta, {
          loading: true,
        })
      }
    }

    case 'MULTI_POOL_SUCCESS': {
      const _results = action.payload
      const dataResult = _results.find((result:any) => result.name === 'data').result
      const balancerLiquidityResult = _results.find((result:any) => result.name === 'balancerLiquidity').result
      const balancerPriceResult = _results.find((result:any) => result.name === 'balancerPrice').result
      const chartDataResult = _results.find((result:any) => result.name === 'chart').result

      const balReturns = (Math.pow((((((dataResult.liquidity / balancerLiquidityResult.totalBalancerLiquidity) * 145000) * balancerPriceResult.balancerPrice) / dataResult.liquidity) + 1 ), 52)) - 1

      const feesAndBalReturns = dataResult.feesApy + balReturns

			return {
        ...state,
        data: {
          ...dataResult,
          ...balancerLiquidityResult,
          ...balancerPriceResult,
          ...chartDataResult,
          balReturns,
          feesAndBalReturns,
        },
        meta: _.merge({}, INITIAL_STATE.meta, {
          success: true,
        })
      }
    }

    case 'MULTI_POOL_ERROR': {
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
