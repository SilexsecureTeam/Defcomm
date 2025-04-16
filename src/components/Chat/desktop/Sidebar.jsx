import mainLogo from "../../../assets/logo-icon.png";
import { Link } from "react-router-dom";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { RiGroup3Line } from "react-icons/ri";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { IoCalendarClearOutline, IoCallOutline, IoSettingsOutline } from "react-icons/io5";

export default function Sidebar() {
    return (
        <div className="w-20 bg-transparent flex flex-col items-center py-4 space-y-6">
            <Link to={"/dashboard/home"}><img src={mainLogo} alt="logo" className="w-14" /></Link>
            <div className="flex-1 flex flex-col justify-center items-center py-4 space-y-6">
            <BiSolidMessageSquareDetail size={20} />
            <RiGroup3Line size={20} />
            <AiOutlineVideoCamera size={20} />
            <IoCallOutline size={20} />
            <IoCalendarClearOutline size={20} />
            <IoSettingsOutline size={20} />
            </div>
        </div>
    );
}
