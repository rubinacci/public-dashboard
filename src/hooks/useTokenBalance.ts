import { JSBI, Token, TokenAmount } from "@uniswap/sdk"
import { useWeb3Result } from "./useWeb3Result"

import ERC20 from "./abi/ERC20.json"
import { Contract } from "ethers"

export const useTokenBalance = (address: string) => {
    return useWeb3Result(async ({ account, chainId, library }) => {
        const signer = library.getSigner(account).connectUnchecked()
        const tokenContract = new Contract(address, ERC20 as any, signer)
        const decimals = await tokenContract.decimals()
        const balance = await tokenContract.balanceOf(account)
        const convertedToken = new Token(chainId!, address, decimals, "", "")
        return new TokenAmount(convertedToken, JSBI.BigInt(balance.toString()))
    })
}
