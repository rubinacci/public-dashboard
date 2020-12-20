import React, { FunctionComponent } from 'react'

import classnames from 'classnames'

import { FiX } from "react-icons/fi"

import Modal, { Props } from 'react-modal'

const ContainerModal: FunctionComponent<Props & {
    title?: string
    padding?: boolean
}> = ({ onRequestClose, title, padding = true, children, ...props }) => (
    <Modal
        overlayClassName={classnames(
            "fixed inset-0",
            "flex items-center justify-center",
            "bg-white bg-opacity-50"
        )}
        className={"relative outline-none"}
        shouldFocusAfterRender={false}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        onRequestClose={onRequestClose}
        style={{ overlay: { zIndex: 100 }, content: { zIndex: 100} }}
        { ...props }>
        <div className="relative">
            <button className="absolute text-black top-0 right-0 mr-4 mt-4" onClick={onRequestClose}><FiX /></button>
            { children }
        </div>
    </Modal>
)

export default ContainerModal