import React, { useState } from 'react'
import classes from './Sidebar.module.scss'
import { NavLink } from 'react-router-dom'
import { POOLS } from '../../Constants/Constants'

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(true)

  return (
    <>
      <div className={classes.container}>
        <div className={classes.logoContainer}>
          <div className={classes.logo} />
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>Tokens</div>
          <div className={classes.sectionLinkContainer}>
            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to="/sta"
            >
              STA / wSTA
            </NavLink>
          </div>
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>Dual-Asset Pools</div>
          <div className={classes.sectionLinkContainer}>
            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to={`/pool/${POOLS.delta.contractAddress}`}
            >
              Delta
            </NavLink>

            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to={`/pool/${POOLS.infinity.contractAddress}`}
            >
              Infinity
            </NavLink>
          </div>
        </div>

        <div className={classes.section}>
          <div className={classes.sectionTitle}>Multi-Asset Pools</div>
          <div className={classes.sectionLinkContainer}>
            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to={`/multi_pool/${POOLS.titan.contractAddress}`}
            >
              Titan
            </NavLink>

            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to={`/multi_pool/${POOLS.highRisk.contractAddress}`}
            >
              High-Risk
            </NavLink>

            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to={`/multi_pool/${POOLS.lowRisk.contractAddress}`}
            >
              Low-Risk
            </NavLink>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
