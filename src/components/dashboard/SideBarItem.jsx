import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiHome } from "react-icons/fi";

function SideBarItem({ data, dispatch, state, setIsOpen }) {
  const navigate = useNavigate();
  const { setAuthDetails } = useContext(AuthContext)

  const navigateToPage = () => {
    if (data.type === "LOG-OUT") {
      sessionStorage.clear();
      dispatch({});
      setAuthDetails(null);
      navigate(data.route, { replace: true });
    } else {
      dispatch({ ...data });
      navigate(data.route);
    }
    setIsOpen(false)
  };

  return (
    <li
      onClick={navigateToPage}
      className={`cursor-pointer flex gap-[10px] hover:bg-green-800 group items-center z-10 p-[5px] ${state?.type === data?.type ? "bg-primaryColor" : "bg-none"
        }`}
    >
      <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700">
        <FiHome size={20} /> {data?.title}
      </Link>

    </li>
  );
}

export default React.memo(SideBarItem);
