import React, { useState } from 'react'
import { FaSignal } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { PiSpeakerHighFill } from "react-icons/pi";
import { AiOutlineAudioMuted } from "react-icons/ai";
import { MdPersonAddAlt, MdPhoneInTalk } from "react-icons/md";

const categories = [
    { title: "Receiver", icon: <MdPhoneInTalk />, bg: "bg-green-600" },
    { title: "Speaker", icon: <PiSpeakerHighFill />, bg: "bg-gray-700" },
    { title: "Mute", icon: <AiOutlineAudioMuted />, bg: "bg-gray-700" },
    { title: "New Call", icon: <MdPersonAddAlt />, bg: "bg-gray-700" },
];

const CallInterface = () => {
    const [call, setCall]=useState(false)
  return (
    <div className="w-full h-max bg-white p-4 py-10 shadow-md flex flex-col items-center mt-4 md:mt-0">
    <p className="text-gray-700 text-center font-medium">Secure Call Initiated from <br/>
    <small className="text-xs text-gray-500">Major John To Sgt Amos</small>
    </p>
    <p className="text-gray-500">Call encrypted: 00:03</p>
    <button className="bg-oliveDark text-white py-2 px-4 rounded-lg mt-2 flex gap-3 items-center justify-around font-medium min-w-[180px]"><FaSignal className="flex-shrink-0" /> Checking call...</button>
    <div className="grid grid-cols-2 gap-4 mt-4 text-white py-5" >
        {categories.map((cat, index) => (
            <div key={index} className={`${index > 0 ? "bg-[#1a2b12]" : "bg-green-600"} hover:bg-green-600/60 cursor-pointer px-4 py-2 flex flex-col items-center justify-center gap-2 text-center`}>
                <span className="text-white text-xl rounded-full">{cat.icon}</span>
                <div>
                    <p className="text-sm">{cat.title}</p>
                </div>
            </div>
        ))}
    </div>
    <div className="relative mt-8 text-gray-700 font-medium">
        <p className="absolute right-3 z-10 top-[-2px]">Secured by </p>
        <img src={logo} alt="Defcomm Icon" className="reltive w-40 filter invert" />
    </div>
    
    <button onClick={()=>setCall(!call)} className={`${call ? "bg-red-500":"bg-green-500"} text-white p-2 rounded-full mt-4 min-w-40 font-bold`}>{call ? "End Call":"Start Call"}</button>
</div>
  )
}

export default CallInterface