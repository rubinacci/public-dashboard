import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"

export const injected = new InjectedConnector({})

// mainnet only https://github.com/Uniswap/uniswap-interface/blob/7cf25ac7c8e2969381ebe71e9a24140902204784/src/connectors/index.ts
const NETWORK_URL = `${ process.env.REACT_APP_NETWORK_URL }`
export const walletConnect = new WalletConnectConnector({ 
    rpc: { 1: NETWORK_URL },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: 15000
});
