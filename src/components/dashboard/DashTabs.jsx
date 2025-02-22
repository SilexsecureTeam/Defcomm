import { motion } from "framer-motion";
import { useState } from "react";
import { dashboardTabs } from "../../utils/constants";

function DashTabs() {
    const [view, setView] = useState("call");
  
    return (
      <motion.ul className="flex gap-2 item-center w-full md:w-[80%] mt-10 ml-auto bg-gray-400/50 p-2 border-l-[5px] border-l-olive overflow-x-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {dashboardTabs?.map((item, idx) => (
        <motion.li key={idx} onClick={() => setView(item?.view)} className={`${view !== item?.view ? "bg-oliveDark/70" : "bg-white"} cursor-pointer p-3 rounded-xl flex-shrink-0`} whileHover={{ scale: 1.1 }}>
          <img src={item?.img} alt="img" className={`${view === item?.view && view !== "call" && "filter invert"} w-8 h-8`} />
        </motion.li>
      ))}
    </motion.ul>

    )
}
export default DashTabs