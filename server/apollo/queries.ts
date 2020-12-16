import { blockClient, healthClient } from "./client"
import { GET_BLOCK, SUBGRAPH_HEALTH } from "./graphql_queries"

export const fetchLatestBlock = async () => {
    const result = await healthClient.query({
      query: SUBGRAPH_HEALTH,
    })
    return result.data.indexingStatusForCurrentVersion.chains[0].latestBlock.number
}

export const fetchBlockFromTimestamp = async (timestamp: number) => {
    let result = await blockClient.query({
        query: GET_BLOCK,
        variables: {
            timestampFrom: timestamp,
            timestampTo: timestamp + 600,
        },
        fetchPolicy: 'cache-first',
    })
    return result?.data?.blocks?.[0]?.number
}
