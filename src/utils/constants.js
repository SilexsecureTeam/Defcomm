//Dashboard icons import
import { FaHome, FaRegUserCircle, FaCog } from "react-icons/fa";
import { MdOutlineCall, MdOutlineFolderShared } from "react-icons/md";
import { IoIosChatboxes, IoMdWifi } from "react-icons/io";
import { BiCategoryAlt } from "react-icons/bi";

//Dasboard tabs icons
import call from "../assets/call.png";
import connect from "../assets/connect.png";
import mail from "../assets/mail-secure.png";
import secure from "../assets/secure.png";
import contact from "../assets/contact.png";
import sharing from "../assets/device.png";
import drive from "../assets/drive.png";
import military from "../assets/military.png";
import talkie from "../assets/walkie-talkie.png";

export const dashboardOptions = [
  {
    type: "HOME",
    title: "Home",
    route: "/dashboard/home",
    icon: BiCategoryAlt,
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
    icon: IoMdWifi,
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

export const dashboardTabs = [
  { 
    img: call, 
    view: "call",
    type: "CHAT", 
  },
  { 
    img: connect, 
    view: "connect",
    type: "CONNECT", 
  },
  { 
    img: secure, 
    view: "secure",
     type: "CONNECT",
  },
  { 
    img: talkie, 
    view: "comm",
     type: "CONNECT",
  },
  { 
    img: drive, 
    view: "drive",
     type: "CONNECT",
  },
  { 
    img: mail, 
    view: "email",
     type: "CONNECT",
  },
  { 
    img: contact, 
    view: "contact",
     type: "CONNECT",
  },
  { 
    img: sharing, 
    view: "sharing",
     type: "CONNECT",
  },
  { 
    img: military, 
    view: "military",
     type: "CONNECT", 
  }
]