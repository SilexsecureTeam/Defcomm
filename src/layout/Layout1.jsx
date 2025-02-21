import React, { useState, useContext, useEffect, lazy, useReducer } from 'react'
import {
    Outlet,
    useNavigate,
    useLocation
} from 'react-router-dom'

import DashboardReducer from "../reducers/DashboardReducer";
import {
    utilOptions,
    dashboardOptions
} from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
const Layout1 = () => {
    //Util Component
    const NavBar = lazy(() => import("../components/dashboard/NavBar"));
    const SideBar = lazy(() => import("../components/dashboard/SideBar"));
    const SideBarItem = lazy(() =>
        import("../components/dashboard/SideBarItem")
    );
    const { authDetails } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const activeReducer = DashboardReducer;
    const options = [...dashboardOptions, ...utilOptions]

    const [state, dispatch] = useReducer(activeReducer, null);

    const navigate = useNavigate();
    const toogleIsOpen = () => setIsOpen(!isOpen);
    const { pathname } = useLocation();

    useEffect(() => {
        const savedState = localStorage.getItem("sidebarState") ? JSON.parse(localStorage.getItem("sidebarState")) : options[0];
        //console.log(pathname)
        if (savedState && pathname === "/dashboard/home") {
            // If no saved state, set a default value based on user type
            const defaultState = options[0];
            dispatch(defaultState);  // Dispatch the default state
        } else {
            dispatch(savedState);  // Dispatch the loaded state
        }
    }, []);  // Empty dependency array ensures this runs only once on mount

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (state) {
            localStorage.setItem("sidebarState", JSON.stringify(state));
        }
    }, [state]);  // This hook will be triggered every time 'state' changes


    const setSideBar = (index) => {
        const page = options[index];
        //console.log(index, page)
        dispatch(page);
    };


    return (
        <div>
            <
                SideBar
                authDetails={authDetails}
                toogleIsOpen={toogleIsOpen}
                isMenuOpen={isOpen}

            >
                <ul className="flex flex-col gap-[10px]">
                    {dashboardOptions.map((currentOption) => (
                        <SideBarItem
                            key={currentOption.type}
                            data={currentOption}
                            dispatch={dispatch}
                            state={state}
                            setIsOpen={setIsOpen}
                        />
                    ))}
                </ul>

                <ul className="flex flex-col gap-[10px]">
                    {utilOptions.map((currentOption) => (
                        <SideBarItem
                            key={currentOption.type}
                            data={currentOption}
                            dispatch={dispatch}
                            state={state}
                            setIsOpen={setIsOpen}
                        />
                    ))}
                </ul>
            </SideBar>

            {/* Routes and dashboard take up 80% of total width and 100% of height*/}
            <div className="flex-1 w-2/3 relative flex bg-transparent flex-col h-full">
                <NavBar
                    state={state}
                    toogleIsOpen={toogleIsOpen}
                    isMenuOpen={isOpen}
                    user={authDetails?.user}
                />
                <div className="w-full h-[92%] overflow-y-auto px-2 lg:px-4 bg-transparent">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout1