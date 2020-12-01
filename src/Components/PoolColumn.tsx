import React, { FunctionComponent } from "react"

import { Pool } from "../Constants/Pool"
import PoolActionsCard from "./cards/PoolActionsCard"
import PoolTopDataCard from "./cards/PoolTopDataCard"
import PoolPriceCard from "./cards/PoolPriceCard"
import PoolVolumeCard from "./cards/PoolVolumeCard"

const PoolColumn: FunctionComponent<{ pool: Pool }> = ({ pool }) => {
    return (
        <>
            <PoolTopDataCard pool={pool} />
            <PoolPriceCard pool={pool} />
            <PoolVolumeCard pool={pool} />
            <PoolActionsCard pool={pool} />
        </>
    )
}

export default PoolColumn