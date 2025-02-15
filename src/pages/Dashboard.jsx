import React,{useContext} from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiLogOut } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

const Dashboard=() => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Defcomm Panel
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            <li>
              <Link to="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700">
                <FiHome size={20} /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700">
                <FiUser size={20} /> Profile
              </Link>
            </li>
          </ul>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg mx-4 my-4">
          <FiLogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Welcome, {user?.name || "User"}</h2>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
