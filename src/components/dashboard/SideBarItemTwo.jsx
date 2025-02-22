import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import mainLogo from "../../assets/logo-icon.png";
import {GoDotFill} from 'react-icons/go'
function SideBarItemTwo({ data, dispatch, state, setIsOpen }) {
  const navigate = useNavigate();
  const { setAuthDetails } = useContext(AuthContext);

  const navigateToPage = () => {
    navigate(data?.route)
    setIsOpen(false);
  };

  return (
    <li
      onClick={navigateToPage}
      className={`cursor-pointer flex gap-[10px] hover:bg-gray-800 group items-center p-3 font-medium ${
        state?.type === data?.type ? "bg-black text-olive" : "bg-none"
      }`}
    >
      <Link className="flex items-center gap-3">
        <figure className="relative w-12 h-12 bg-gray-300 rounded-full">
        <img src={data?.image} alt={data?.title} className="rounded-full"/>
        <span className={`${
            data?.status === "Online"
              ? "bg-green-500"
              : data?.status === "Busy"
              ? "bg-red-500"
              : data?.status === "Away"
              ? "bg-yellow"
              : "bg-gray-400"
          } w-3 h-3 absolute bottom-[-2%] right-[5%] rounded-full border-[2px] border-white`}></span>
        </figure>
        {data?.name}
      </Link>
    </li>
  );
}

export default React.memo(SideBarItemTwo);
