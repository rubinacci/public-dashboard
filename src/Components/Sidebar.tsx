import React, { FunctionComponent, useState } from "react"

import Modal from "react-modal"

import { NavLink } from "react-router-dom"

import ContainerModal from "./ContainerModal"

import { RiDashboardLine } from "react-icons/ri"
import { FiPieChart } from "react-icons/fi"
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi"
import { ImExit } from "react-icons/im"

import logo from "../assets/logo.png"
import metamask from "../assets/images/web3/metamask.svg"

import { useWeb3React } from "@web3-react/core"
import { injected } from "../web3/connectors"
import { formatAccount } from "../util/formatAccount"

const ConnectModal: FunctionComponent<Modal.Props> = ({ ...props }) => {

    const { active, activate } = useWeb3React()

    return (
        <ContainerModal
            className="bg-white rounded-md shadow-lg"
            { ...props }
        >
            <div className="flex flex-col space-y-4 p-4 px-16">
                <h1 className="font-bold text-blue-500">Connect your wallet</h1>
                <div className="flex flex-row w-full">
                    <button
                        className="flex flex-col items-center p-4 border border-blue-500 rounded-md"
                        onClick={e => { activate(injected); props.onRequestClose!(e) }}>
                        <span>
                            Connect with Metamask
                        </span>
                        <img src={metamask} alt="metamask" className="h-8" />
                    </button>
                </div>
            </div>
        </ContainerModal>
    )
}

const Sidebar = () => {

    const [poolsOpen, setPoolsOpen] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)

    const DropdownIcon = poolsOpen ? HiOutlineChevronUp : HiOutlineChevronDown

    const { account, active, deactivate } = useWeb3React()

    return <>
        <div className="flex flex-col w-56 h-full bg-gray-100 text-sm">
            <div className="flex flex-col space-y-2 items-center py-8">
                <img src={logo} alt="logo" className="w-16 shadow-sm rounded-full" />
                { active ? (
                    <div className="flex flex-row items-center space-x-1">
                        <span>{ formatAccount(account) }</span>
                        <button className="text-gray-500 hover:text-red-500" onClick={deactivate}>
                            <ImExit />
                        </button>
                    </div>
                ) : (
                    <button className="px-4 py-1 text-xs rounded-md gradient-x text-white font-bold" onClick={() => setModalOpen(true)}>Connect wallet</button>
                ) }
                <span className="text-gray-500 text-xs">Info message</span>
            </div>
            <div className="flex-1 flex flex-col space-y-2 items-start shadow-inner py-4 pr-8 text-gray-500">
                <NavLink
                    to="/"
                    activeClassName="gradient-x text-white"
                    className="flex flex-row items-center space-x-2 mr-4 px-4 py-2 rounded-r-md w-full">
                    <RiDashboardLine className="text-xl" /><span className="font-thin">Dashboard</span>
                </NavLink>
                <div className="flex flex-col space-y-2 w-full">
                    <button
                        onClick={() => setPoolsOpen(!poolsOpen)}
                        className="flex flex-row items-center space-x-2 mr-4 px-4 py-2 text-white rounded-r-md w-full text-gray-500 pr-2">
                        <FiPieChart className="text-xl" /><span className="font-thin">Pools</span><DropdownIcon size="1rem" style={{ marginLeft: "auto" }} />
                    </button>
                    { poolsOpen ? (
                        <div className="flex-1 flex flex-col space-y-2 border-l border-gray-500 text-gray-500 ml-10">
                            <button className="flex flex-row items-center w-full px-4 py-2">
                                Statera
                            </button>
                            <button className="flex flex-row items-center w-full px-4 py-2">
                                Delta
                            </button>
                            <button className="flex flex-row items-center w-full px-4 py-2">
                                Phoenix Fund
                            </button>
                        </div>
                    ) : null }
                </div>
            </div>
        </div>
        <ConnectModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} />
    </>
}

export default Sidebar