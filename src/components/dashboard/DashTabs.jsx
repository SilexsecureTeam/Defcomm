import call from "../../assets/call.png";
import scroll from "../../assets/scroll.png";
import connect from "../../assets/connect.png";
import mail from "../../assets/mail-secure.png";
import secure from "../../assets/secure.png";


import contact from "../../assets/contact.png";
import sharing from "../../assets/device.png";
import drive from "../../assets/drive.png";
import military from "../../assets/military.png";

import talkie from "../../assets/walkie-talkie.png";
import { motion } from "framer-motion";
import { useState } from "react";

function DashTabs() {
    const [view, setView] = useState("call");
  
    return (
      <motion.ul className="flex gap-2 item-center w-full md:w-[80%] mt-10 ml-auto bg-gray-500/50 p-2 border-l-8 border-l-olive overflow-x-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
      {[{ img: call, view: "call" },
      { img: connect, view: "connect" },
      { img: secure, view: "secure" },
      { img: talkie, view: "comm" },
      { img: drive, view: "drive" },
      { img: mail, view: "email" },
      { img: contact, view: "contact" },
      { img: sharing, view: "sharing" },
      { img: military, view: "military" }
      ]?.map((item, idx) => (
        <motion.li key={idx} onClick={() => setView(item?.view)} className={`${view !== item?.view ? "bg-oliveDark/70" : "bg-white"} cursor-pointer p-3 rounded-xl flex-shrink-0`} whileHover={{ scale: 1.1 }}>
          <img src={item?.img} alt="img" className={`${view === item?.view && view !== "call" && "filter invert"} w-8 h-8`} />
        </motion.li>
      ))}
    </motion.ul>

    )
}
export default DashTabs