import { ApolloClient } from "apollo-client"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"
import fetch from "node-fetch"

export const uniswapClient = new ApolloClient({
    link: new HttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
        fetch: fetch as any
    }),
    cache: new InMemoryCache()
})

export const balancerClient = new ApolloClient({
    link: new HttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer',
        fetch: fetch as any
    }),
    cache: new InMemoryCache()
})
  
export const healthClient = new ApolloClient({
    link: new HttpLink({
        uri: 'https://api.thegraph.com/index-node/graphql',
        fetch: fetch as any
    }),
    cache: new InMemoryCache()
})

export const blockClient = new ApolloClient({
    link: new HttpLink({
        uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
        fetch: fetch as any
    }),
    cache: new InMemoryCache()
})