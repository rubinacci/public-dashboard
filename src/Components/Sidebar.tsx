import React, { FunctionComponent, useState } from "react"

import Modal from "react-modal"

import classnames from "classnames"

import { NavLink } from "react-router-dom"

import ContainerModal from "./ContainerModal"

import { RiCloseLine, RiDashboardLine } from "react-icons/ri"
import { FiPieChart } from "react-icons/fi"
import { HiOutlineChevronDown, HiOutlineChevronUp } from "react-icons/hi"
import { ImExit } from "react-icons/im"
import { GiHamburgerMenu } from "react-icons/gi"

import logo from "../assets/logo.png"
import metamask from "../assets/images/web3/metamask.svg"
import walletconnect from "../assets/images/web3/walletconnect.svg"

import { useWeb3React } from "@web3-react/core"
import { injected, walletConnect } from "../web3/connectors"
import { formatAccount } from "../util/formatAccount"

const ConnectModal: FunctionComponent<Modal.Props> = ({ ...props }) => {

    const { activate } = useWeb3React()

    return (
        <ContainerModal
            className="bg-white rounded-md shadow-lg"
            { ...props }
        >
            <div className="flex flex-col space-y-4 p-4 px-16">
                <h1 className="font-bold text-blue-500">Connect your wallet</h1>
                <div className="flex flex-col md:flex-row w-full p-8 space-x-2">
                    <button
                        className="flex flex-col w-64 space-y-4 items-center p-4 border border-blue-500 rounded-md gradient-x"
                        onClick={e => { activate(injected); props.onRequestClose!(e) }}>
                        <span className="text-white font-bold">
                            Connect with<br/>Metamask
                        </span>
                        <img src={metamask} alt="metamask" className="h-8" />
                    </button>
                    <button
                        className="flex flex-col w-64 space-y-4 items-center p-4 border border-blue-500 rounded-md gradient-x"
                        onClick={e => { activate(walletConnect, undefined, true); props.onRequestClose!(e) }}>
                        <span className="text-white font-bold">
                            Connect with<br/>Walletconnect
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

    const DropdownIcon = poolsOpen ? HiOutlineChevronUp : HiOutlineChevronDown

    const { account, active, deactivate } = useWeb3React()

    return <>
        <div
            className={classnames(
                "w-screen h-screen bg-black bg-opacity-25 absolute top-0 right-0 transition-all duration-500",
                !menuOpen ? "opacity-0 invisible" : "lg:opacity-0 lg:invisible"
            )}
            style={{ zIndex: 40 }} />
        <div
            className={classnames(
                "flex flex-col w-56 h-full gradient-x text-sm",
                "transition-all duration-200",
                "fixed lg:relative text-white",
                !menuOpen && "-ml-56 lg:ml-0",
            )} style={{ zIndex: 50 }}>

            <div className="relative">
                <button className={classnames(
                    "absolute top-0 right-0 text-gray-300 p-2 mt-1 mr-1 transition-all duration-500",
                    !menuOpen ? "invisible opacity-0" : "lg:invisible lg:opacity-0"
                )} onClick={() => setMenuOpen(false)}>
                    <RiCloseLine size="1.6rem" className={classnames("transition-all duration-500", !menuOpen && "transform -rotate-90")} />
                </button>
                <button className={classnames(
                    "absolute top-0 left-0 p-2 bg-white rounded-full shadow-lg mt-1 transition-all duration-200",
                    "gradient-x text-white border-4 border-white",
                    menuOpen ? "invisible opacity-0" : "lg:invisible lg:opacity-0"
                )} onClick={() => setMenuOpen(true)} style={{ marginLeft: "14.5rem" }}>
                    <GiHamburgerMenu size="1.6rem" className={classnames("transition-all duration-200", menuOpen && "transform -rotate-90")} />
                </button>
            </div>

            <div className="flex flex-col space-y-2 items-center py-8">
                <img src={logo} alt="logo" className="w-16 shadow-sm rounded-full" />
                { active ? (
                    <div className="flex flex-row items-center space-x-1">
                        <span>{ formatAccount(account) }</span>
                        <button className="text-gray-300 hover:text-red-500" onClick={deactivate}>
                            <ImExit />
                        </button>
                    </div>
                ) : (
                    <button className="px-4 py-1 text-xs rounded-md bg-white text-white font-bold" onClick={() => setModalOpen(true)}><span className="text-gradient">Connect wallet</span></button>
                ) }
                <span className="text-gray-300 text-xs">Info message</span>
            </div>
            <div className="flex-1 flex flex-col space-y-2 items-start shadow-inner py-4 pr-8 text-gray-300">
                <NavLink
                    to="/"
                    exact
                    activeClassName="bg-white text-gray-600"
                    className="flex flex-row items-center space-x-2 mr-4 px-4 py-2 rounded-r-md w-full">
                    <RiDashboardLine className="text-xl" /><span className="font-thin">Dashboard</span>
                </NavLink>
                <div className="flex flex-col space-y-2 w-full">
                    <button
                        onClick={() => setPoolsOpen(!poolsOpen)}
                        className="flex flex-row items-center space-x-2 mr-4 px-4 py-2 text-white rounded-r-md w-full text-gray-300 pr-2">
                        <FiPieChart className="text-xl" /><span className="font-thin">Pools</span><DropdownIcon size="1rem" style={{ marginLeft: "auto" }} />
                    </button>
                    { poolsOpen ? (
                        <div className="flex-1 flex flex-col space-y-2 border-l border-gray-300 text-gray-300 ml-10 font-thin">
                            <NavLink
                                to="/statera"
                                activeClassName="bg-white text-gray-600 -ml-10"
                                activeStyle={{ paddingLeft: "calc(2.5rem + 1rem)", width: "calc(100% + 2.5rem)" }}
                                className="flex flex-row items-center space-x-2 mr-4 px-4 py-2 rounded-r-md w-full">
                                Statera
                            </NavLink>
                            <NavLink
                                to="/delta"
                                activeClassName="bg-white text-gray-600 -ml-10"
                                activeStyle={{ paddingLeft: "calc(2.5rem + 1rem)", width: "calc(100% + 2.5rem)" }}
                                className="flex flex-row items-center space-x-2 mr-4 px-4 py-2 rounded-r-md w-full">
                                Delta
                            </NavLink>
                            <NavLink
                                to="/phoenix"
                                activeClassName="bg-white text-gray-600 -ml-10"
                                activeStyle={{ paddingLeft: "calc(2.5rem + 1rem)", width: "calc(100% + 2.5rem)" }}
                                className="flex flex-row items-center space-x-2 mr-4 px-4 py-2 rounded-r-md w-full">
                                Phoenix
                            </NavLink>
                        </div>
                    ) : null }
                </div>
            </div>
        </div>
        <ConnectModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} />
    </>
}

export default Sidebar