import React, { Dispatch } from "react"
import { CurrencyAmount } from "@uniswap/sdk"
import { createContext, FunctionComponent, useReducer } from "react"

export type State = {
    ethPrice?: CurrencyAmount
    currency: "eth" | "usd"
    chartData: any
    statsData: any
}

export type Action = {
    type: string
    data: any
}

export const initialState: State = {
    ethPrice: undefined,
    currency: "eth",
    chartData: {},
    statsData: {}
}

export const Reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_ethPrice": return {
            ...state,
            ethPrice: action.data
        }
        case "SET_currency": return {
            ...state,
            currency: action.data as ("eth" | "usd")
        }
        case "SET_chartData": return {
            ...state,
            chartData: action.data as any
        }
        case "SET_statsData": return {
            ...state,
            statsData: action.data as any
        }
        default: return state
    }
}

export type ContextProps = {
    state: State
    dispatch: Dispatch<Action>
}

export const Context = createContext<ContextProps>({
    dispatch: () => {},
    state: initialState
})
export const Store: FunctionComponent = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState)
    return (
        <Context.Provider value={{ state, dispatch }}>
            { children }
        </Context.Provider>
    )
}