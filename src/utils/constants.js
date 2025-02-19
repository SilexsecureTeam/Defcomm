//Applicant icons import

import { FaHome, FaRegUserCircle, FaCog } from "react-icons/fa";
import { MdOutlineCall, MdOutlineFolderShared  } from "react-icons/md";
import { IoIosChatboxes, IoMdWifi } from "react-icons/io";
//import logout from "../assets/pngs/logout.png";
export const dashboardOptions = [
  {
    type: "HOME",
    title: "Home",
    route: "/dashboard/home",
    icon: FaHome,
    iconActive: null,
  },
  {
    type: "CHAT",
    title: "Secure Chat",
    route: "/dashboard/chat",
    icon: IoIosChatboxes,
    iconActive: null,
  },
  {
    type: "CALLS",
    title: "Secure Calls",
    route: "/dashboard/calls",
    icon: MdOutlineCall,
    iconActive: null,
  },
  {
    type: "COMM",
    title: "Walkie talkie",
    route: "/dashboard/comm",
    icon: IoMdWifi ,
    iconActive: null,
  },
  {
    type: "FILE-SHARING",
    title: "File Sharing",
    route: "/dashboard/file-sharing",
    icon: MdOutlineFolderShared,
    iconActive: null,
  },
];

export const utilOptions = [
  {
    type: "PROFILE",
    title: "Profile",
    route: "/dashboard/profile",
    icon: FaRegUserCircle,
    iconActive: null,
  },
  {
    type: "SETTINGS",
    title: "Settings",
    route: "/dashboard/settings",
    icon: FaCog,
    iconActive: null,
  }
];
