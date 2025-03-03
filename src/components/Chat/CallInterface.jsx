import React, { useState } from 'react'
import Modal from "../modal/Modal";
import callImg from "../../assets/call.png";
import { FaCog } from "react-icons/fa";
import Settings from '../../pages/Settings';

const CallInterface = ({setShowCall}) => {
    const [isOpen, setIsOpen] =useState(false);
    return (
        <>
            <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
                <Settings />
            </Modal>
            <div className="font-bold">
                <div
                    onClick={() => {
                        setShowCall(true);
                    }}
                    className="bg-oliveGreen hover:bg-green-600/60 text-white cursor-pointer p-2 flex flex-col items-center justify-center gap-2 text-center h-20"
                >
                    <img src={callImg} alt="img" className="w-8" />
                    <div>
                        <p className="text-sm">Secure call</p>
                    </div>
                </div>

                <div onClick={() => {
                        setIsOpen(true);
                    }}
                     className="bg-oliveLight hover:bg-green-600/60 text-white cursor-pointer px-4 py-2 flex flex-col items-center justify-center gap-2 text-center h-20">
                    <FaCog size={30} />
                    <div>
                        <p className="text-sm">Settings</p>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default CallInterface