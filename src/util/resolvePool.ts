import _ from 'lodash'
import { POOLS, ASSETS } from '../Constants/Constants'

export function resolvePoolFromContractAddress(contractAddress:string) {
  let foundPool:any
  _.mapValues(POOLS, (pool, key) => {
    if (pool.contractAddress === contractAddress) {
      foundPool = {
        ...pool,
        assets: pool.assets.map(poolAsset => {
          const foundAsset = _.find(ASSETS, (asset:any) => asset.contractAddress === poolAsset.contractAddress)
          return {
            ...poolAsset,
            ...foundAsset,
          }
        })
      }
    }
  })

  return foundPool
}
