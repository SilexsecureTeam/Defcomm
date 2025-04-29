//Dashboard icons import
import { FaHome, FaRegUserCircle, FaCog, FaRobot } from "react-icons/fa";
import { MdGroups, MdOutlineCall, MdOutlineFolderShared } from "react-icons/md";
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
    type: "GROUP",
    title: "Secure Groups",
    route: "/dashboard/groups",
    icon: MdGroups,
    iconActive: null,
  },
  {
    type: "AI",
    title: "iSurvive",
    route: "/dashboard/isurvive",
    icon: FaRobot,
    iconActive: null,
  },
  {
    type: "CALLS",
    title: "Secure Calls",
    route: "/dashboard/contacts",
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
    type:"CALL",
    title: "Call",
    img: call, 
    view: "chat",
    type: "CHAT",
    route:"/dashboard/chat"
  },
  { 
    type:"CONNECT",
    title: "Discover",
    img: connect, 
    view: "connect",
    type: "CONNECT", 
    route:"/dashboard/home"
  },
  { 
    type:"SECURE",
    title: "Secure",
    img: secure, 
    view: "secure",
     route:"/dashboard/secure"
  },
  { 
    type:"COMM",
    title: "Walkie talkie",
    img: talkie, 
    view: "comm",
    route:"/dashboard/comm", 
  },
  { 
    type:"DRIVE",
    title: "Drive",
    img: drive, 
    view: "drive",
    route:"/dashboard/drive", 
  },
  { 
    type:"MAIL",
    title: "Mail",
    img: mail, 
    view: "email",
    route:"/dashboard/mail", 
  },
  { 
    type:"CONTACT",
    title: "Contact",
    img: contact, 
    view: "contact",
    route:"/dashboard/contacts", 
  },
  { 
    type:"FILE-SHARING",
    title: "File Sharing",
    img: sharing, 
    view: "sharing",
    route:"/dashboard/file-sharing", 
  },
  { 
    type:"MILITARY",
    title: "Military",
    img: military, 
    view: "military",
    route:"/dashboard/isurvive",  
  }
]

export const contactList=[
  {
    "id": 1,
    "name": "Michael Johnson",
    "image": "/images/users/michael-johnson.png",
    "status": "Online",
  },
  {
    "id": 2,
    "name": "Emma Williams",
    "image": "/images/users/emma-williams.png",
    "status": "Offline",
  },
  {
    "id": 3,
    "name": "James Anderson",
    "image": "/images/users/james-anderson.png",
    "status": "Active Now",
  },
  {
    "id": 4,
    "name": "Olivia Brown",
    "image": "/images/users/olivia-brown.png",
    "status": "Busy",
  },
  {
    "id": 5,
    "name": "William Martinez",
    "image": "/images/users/william-martinez.png",
    "status": "Away",
  }
]

export const chatUtilOptions=[
  {
    "id": 6,
    "name": "William Martinez",
    "message":"GG Bro, 2nd place is great thanks",
    "image": "/images/users/william-martinez.png",
    "status": "Away",
  },
  {
    "id": 7,
    "name": "William Martinez",
    "message":"Well played, bro!",
    "image": "/images/users/william-martinez.png",
    "status": "Away",
  }
]