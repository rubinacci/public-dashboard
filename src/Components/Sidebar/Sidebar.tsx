import React, { FunctionComponent, useState } from 'react'
import Modal from 'react-modal'
import classes from './Sidebar.module.scss'
import { NavLink } from 'react-router-dom'
import ContainerModal from '../ContainerModal'
import metamask from '../../assets/images/web3/metamask.svg'
import walletconnect from '../../assets/images/web3/walletconnect.svg'
import { useWeb3React } from '@web3-react/core'
import { injected, walletConnect } from '../../web3/connectors'
import { POOLS } from '../../Constants/Constants'

const ConnectModal: FunctionComponent<Modal.Props> = ({ ...props }) => {
  const { activate } = useWeb3React()

  return (
    <ContainerModal
      className="bg-white rounded-md shadow-lg"
      {...props}
    >
      <div className="flex flex-col space-y-4 p-4 px-16">
        <h1 className="font-bold text-blue-500">Connect your wallet</h1>
        <div className="flex flex-col md:flex-row w-full p-8 space-y-2 md:space-y-0 md:space-x-2">
          <button
            className="flex flex-col w-64 space-y-4 items-center p-4 border border-blue-500 rounded-md gradient-x"
            onClick={e => { activate(injected); props.onRequestClose!(e) }}>
            <span className="text-white font-bold">
              Connect with<br />Metamask
            </span>
            <img src={metamask} alt="metamask" className="h-8" />
          </button>
          <button
            className="flex flex-col w-64 space-y-4 items-center p-4 border border-blue-500 rounded-md gradient-x"
            onClick={e => { activate(walletConnect, undefined, true); props.onRequestClose!(e) }}>
            <span className="text-white font-bold">
              Connect with<br />Walletconnect
            </span>
            <img src={walletconnect} alt="metamask" className="h-8" />
          </button>
        </div>
      </div>
    </ContainerModal>
  )
}

const Sidebar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [poolsOpen, setPoolsOpen] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const { account, active, deactivate } = useWeb3React()

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
              to="/token/alpha"
            >
              Alpha
            </NavLink>

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
              to="/token/high-risk"
            >
              High-Risk
            </NavLink>

            <NavLink
              className={classes.sectionLink}
              activeClassName={classes.active}
              to="/token/low-risk"
            >
              Low-Risk
            </NavLink>
          </div>
        </div>
      </div>
      <ConnectModal isOpen={modalOpen} onRequestClose={() => { setModalOpen(false); setMenuOpen(false) }} />
    </>
  )
}

export default Sidebar
