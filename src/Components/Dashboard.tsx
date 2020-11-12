import React from "react"
import { Pool } from "../Constants/Pool"
import PoolTopDataCard from "./PoolTopDataCard"

const Dashboard = () => (
    <div className="flex-1 flex flex-row px-8 py-6 space-x-4">
        <div className="flex-1 flex flex-col space-y-4">
            <PoolTopDataCard pool={Pool.STATERA} />
            <div className="flex-1 flex flex-col gradient-x rounded-md shadow-md p-2">
                2
            </div>
            <div className="flex-1 flex flex-col gradient-x rounded-md shadow-md p-2">
                3
            </div>
            <div className="flex-1 flex flex-col gradient-x rounded-md shadow-md p-2">
                4
            </div>
        </div>
        <div className="flex-1 flex flex-col space-y-4">
            <PoolTopDataCard pool={Pool.DELTA} />
            <div className="flex-1 flex flex-col gradient-x rounded-md shadow-md p-2">
                2
            </div>
            <div className="flex-1 flex flex-col gradient-x rounded-md shadow-md p-2">
                3
            </div>
            <div className="flex-1 flex flex-col gradient-x rounded-md shadow-md p-2">
                4
            </div>
        </div>
        <div className="flex-1 flex flex-col space-y-4">
            <PoolTopDataCard pool={Pool.PHOENIX} />
            <div className="flex-1 flex flex-col gradient-x rounded-md shadow-md p-2">
                2
            </div>
            <div className="flex-1 flex flex-col gradient-x rounded-md shadow-md p-2">
                3
            </div>
            <div className="flex-1 flex flex-col gradient-x rounded-md shadow-md p-2">
                4
            </div>
        </div>
        <div className="flex-1 flex flex-col space-y-4">
            <div className="flex-1 flex flex-col gradient-x rounded-md shadow-md p-2">
                1
            </div>
            <div className="flex-1 flex flex-col gradient-x rounded-md shadow-md p-2">
                2
            </div>
            <div className="flex-1 flex flex-col gradient-x rounded-md shadow-md p-2">
                3
            </div>
            <div className="flex-1 p-2" />
        </div>
    </div>
)

export default Dashboard