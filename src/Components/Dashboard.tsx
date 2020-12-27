import React from "react"

import { Pool } from "../Constants/Pool"
import AllPoolsCard from "./cards/AllPoolsCard"
import MiscLinksCard from "./cards/MiscLinksCard"
import PoolVolumeCard from "./cards/PoolVolumeCard"
import SupplyTrackerCard from "./cards/SupplyTrackerCard"
import PoolColumn from "./PoolColumn"

const Dashboard = () => (
    <div className="flex flex-col lg:flex-row w-full lg:h-full py-4 px-6 lg:space-x-2 space-y-16 lg:space-y-0">
        <div className="flex flex-col space-y-16 md:space-y-0 md:flex-row w-full lg:w-1/2 md:space-x-2">
            <div className="grid grid-rows-4 w-full md:w-1/2 space-y-2">
                <PoolColumn pool={Pool.STATERA} />
            </div>
            { <hr className="lg:hidden" /> }
            {/* <div className="grid grid-rows-4 w-full md:w-1/2 space-y-2">
                <PoolColumn pool={Pool.DELTA} />
            </div> */}
             <div className="grid grid-rows-4 w-full md:w-1/2 space-y-2">
                <PoolColumn pool={Pool.WSTA} />
            </div>
        </div>
        { <hr className="lg:hidden" /> }
        <div className="flex flex-col space-y-16 md:space-y-0 md:flex-row w-full lg:w-1/2 md:space-x-2">
            <div className="grid grid-rows-4 w-full md:w-1/2 space-y-2">
                <PoolColumn pool={Pool.STANOS} />
            </div>
            { <hr className="lg:hidden" /> }
            <div className="grid grid-rows-4 w-full md:w-1/2 space-y-2">
                <AllPoolsCard />
                <MiscLinksCard />
                <PoolVolumeCard pool={null} />
                <SupplyTrackerCard />
            </div>
        </div>
    </div>
)

export default Dashboard