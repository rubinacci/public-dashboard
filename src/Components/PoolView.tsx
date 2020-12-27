import React, { FunctionComponent } from "react"
import { Pool } from "../Constants/Pool"
import AllPoolsCard from "./cards/AllPoolsCard"
import MiscLinksCard from "./cards/MiscLinksCard"
import PoolBalance from "./cards/PoolBalance"
import PoolPriceCard from "./cards/PoolPriceCard"
import PoolTopDataCard from "./cards/PoolTopDataCard"
import PoolVolumeCard from "./cards/PoolVolumeCard"
import PriceHistoryCard from "./cards/PriceHistoryCard"
import SupplyTrackerCard from "./cards/SupplyTrackerCard"
import TransactionsListCard from "./cards/TransactionsListCard"

const PoolView: FunctionComponent<{ pool: Pool }> = ({ pool }) => (
    <div className="flex flex-col w-full lg:h-full py-4 px-6 space-y-16 lg:space-y-2">

        <div className="flex flex-col lg:flex-row w-full space-y-2 lg:space-y-0 lg:space-x-2 lg:h-1/4">
            <div className="flex flex-col w-full lg:w-1/2 md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                <PoolTopDataCard pool={Pool.STATERA} />
                {/* <PoolTopDataCard pool={Pool.DELTA} /> */}
                <PoolTopDataCard pool={Pool.WSTA} />
            </div>
            <div className="flex flex-col w-full lg:w-1/2 md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                <PoolTopDataCard pool={Pool.STANOS} />
                <AllPoolsCard />
            </div>
        </div>

        { <hr className="lg:hidden" /> }

        <div className="flex flex-col lg:flex-row w-full space-y-2 lg:space-y-0 lg:space-x-2 lg:h-1/2">
            <div className="flex flex-row lg:flex-col lg:w-1/4 lg:h-full space-x-2 lg:space-x-0 lg:space-y-2">
                <PoolPriceCard pool={pool} />
                <PoolVolumeCard pool={pool} />
            </div>
            <div className="flex flex-col w-full lg:w-1/2">
                <TransactionsListCard pool={pool} />
            </div>
            <div className="flex flex-row lg:flex-col lg:w-1/4 lg:h-full space-x-2 lg:space-x-0 lg:space-y-2">
                <MiscLinksCard />
                <PoolVolumeCard pool={null} />
            </div>
        </div>

        { <hr className="lg:hidden" /> }

        <div className="flex flex-col lg:flex-row w-full space-y-2 lg:space-y-0 lg:space-x-2 lg:h-1/4">
            <div className="flex w-full lg:w-1/2">
                <PriceHistoryCard pool={pool} />
            </div>
            <div className="flex w-full lg:w-1/4">
                <PoolBalance />
            </div>
            <div className="flex w-1/4">
                <SupplyTrackerCard />
            </div>
        </div>
    </div>
)

export default PoolView