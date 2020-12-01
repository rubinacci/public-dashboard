import { useEffect, useState } from "react"

import { CurrencyAmount } from "@uniswap/sdk"
import JSBI from "jsbi"
import { useWeb3React } from "@web3-react/core"

export const useETHBalance = () => {
    const { account, library, chainId } = useWeb3React()

    const [balance, setBalance] = useState<CurrencyAmount | null | undefined>()
    useEffect(() => {
        if (!!account && !!library) {
            let stale = false
            const refreshBalance = async () => {
                try {
                    const balance = await library.getBalance(account)
                    const formattedBalance = CurrencyAmount.ether(JSBI.BigInt(balance.toString()))
                    if (!stale) setBalance(formattedBalance)
                } catch {
                    if (!stale) setBalance(null)
                }
            }
            refreshBalance()
            return () => {
                stale = true
                //setBalance(undefined)
            }
        }
    }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

    return balance
}