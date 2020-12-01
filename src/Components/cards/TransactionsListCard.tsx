import React, { FunctionComponent } from "react"
import { gql, useQuery } from "@apollo/client"

import { Pool } from "../../Constants/Pool"

import logo from "../../assets/images/pools/statera.png"
import { formatAccount } from "../../util/formatAccount"

import { CurrencyAmount } from "@uniswap/sdk"
import { parseEther } from "ethers/lib/utils"
import { RiExternalLinkLine } from "react-icons/ri"
import { CgSpinner } from "react-icons/cg"

const STA_ETH_PAIR = "0x59f96b8571e3b11f859a09eaf5a790a138fc64d0"
const GET_TRANSACTIONS = gql`
    query getTransactionsForPair($pair: String!) {
        swaps(first: 10, where: { pair: $pair } orderBy: timestamp, orderDirection: desc) {
            transaction {
                id
                timestamp
            }
            id
            pair {
                token0 {
                    id
                    symbol
                }
                token1 {
                    id
                    symbol
                }
            }
            amount0In
            amount0Out
            amount1In
            amount1Out
            amountUSD
            to
        }
    }
`

const TransactionsListCard: FunctionComponent<{ pool: Pool }> = ({ pool }) => {

    const { loading, data } = useQuery(GET_TRANSACTIONS, { variables: { pair: STA_ETH_PAIR } })

    return (
        <div className="flex-1 flex flex-col rounded-md shadow-sm text-white text-xs pb-2 border border-gray-400 border-opacity-25 overflow-y-scroll">
            <div className="flex flex-row justify-between m-2 text-gray-500 font-semibold">
                <span className="">Transactions List</span>
                <a className="flex flex-row space-x-1 items-center" href={`https://uniswap.exchange`} target="_blank" rel="noreferrer noopener">
                    <span>More on Uniswap</span>
                    <RiExternalLinkLine />
                </a>
            </div>
            { loading ? <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                <CgSpinner className="animate-spin" size="2rem" />
            </div> : null }
            <table className="table-auto text-gray-500 text-left mx-2 border-separate" style={{ borderSpacing: "0 0.5rem" }}>
                <thead>
                    <tr>
                        <th></th>
                        <th>To</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    { data ? data.swaps.map((swap: any) => {
                        const [day, time] = new Date(swap.transaction.timestamp * 1000).toLocaleString().split(", ")
                        const type = swap.amount0In === "0" ? "Buy" : "Sell"
                        const amount = swap.amount0In === "0" ? swap.amount0Out : swap.amount0In
                        return (
                            <tr className="" key={swap.transaction.id}>
                                <td><img src={logo} alt="sta logo" className="w-6" /></td>
                                <td>{ formatAccount(swap.to) }</td>
                                <td>{ CurrencyAmount.ether(parseEther(amount).toString()).toSignificant(4) }</td>
                                <td>{ day }<br/>{ time }</td>
                                <td className={type === "Buy" ? "text-green-600" : "text-red-600"}>{ type }</td>
                                <td className="text-right">
                                    <a
                                        href={`https://etherscan.io/tx/${swap.transaction.id}`} target="_blank" rel="noreferrer noopener"
                                        className="px-2 py-1 gradient-x text-white font-bold rounded-md">
                                        Transaction
                                    </a>
                                </td>
                            </tr>
                        )
                    }) : null }
                </tbody>
            </table>
        </div>
    )
}

export default TransactionsListCard