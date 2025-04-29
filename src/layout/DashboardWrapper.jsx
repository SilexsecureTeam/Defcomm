import { useContext, useMemo, useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { utilOptions, dashboardOptions, dashboardTabs } from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
import { DashboardContext } from "../context/DashboardContext";
import { ChatContext } from "../context/ChatContext";
import useChat from "../hooks/useChat";
import DashboardLayout from "./DashboardLayout";
// Sidebar Components
import SideBar from "../components/dashboard/SideBar";
import AiSideBar from "../components/dashboard/AiSideBar";
import SideBarTwo from "../components/dashboard/SideBarTwo";
import SideBarItem from "../components/dashboard/SideBarItem";
import SideBarItemTwo from "../components/dashboard/SideBarItemTwo";
import NavBar from "../components/dashboard/NavBar";
import Modal from '../components/modal/Modal'
import CallComponent from '../components/video-sdk/CallComponent'
import Settings from '../pages/Settings'


const DashboardWrapper = ({children}) => {
    const { authDetails } = useContext(AuthContext);
     const { 
        setSelectedChatUser, 
        showCall,setShowCall,
        showSettings,
        meetingId, setMeetingId} = useContext(ChatContext);
    const { state, dispatch } = useContext(DashboardContext);
    const { fetchContacts } = useChat();
    const { pathname } = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // Fetch chat contacts (only if type is CHAT)
    const { data: contacts, isLoading } = useQuery({
        queryKey: ["contacts"],
        queryFn: fetchContacts,
        enabled: state?.type === "CHAT",
        staleTime: 0,
    });

    const toggleIsOpen = () => setIsOpen((prev) => !prev);

    // Setup sidebar based on route/type
    const { SidebarComponent, SidebarItemComponent, optionList } = useMemo(() => {
        let Sidebar = SideBar;
        let SidebarItem = SideBarItem;
        let option = dashboardOptions;

        if (pathname === "/dashboard/isurvive/chat" || pathname === "/dashboard/isurvive/voice") {
            Sidebar = AiSideBar;
            SidebarItem = null;
            option = [];
        } else if (state?.type === "CHAT") {
            Sidebar = SideBarTwo;
            SidebarItem = SideBarItemTwo;
            option = contacts || [];
        }

        return { SidebarComponent: Sidebar, SidebarItemComponent: SidebarItem, optionList: option };
    }, [pathname, state?.type, contacts]);

    // Handle route change and reset state
    useLayoutEffect(() => {
        const matchedOption = [...dashboardOptions, ...utilOptions, ...dashboardTabs].find((opt) => pathname === opt.route);
        if (matchedOption) dispatch(matchedOption);
        if (!matchedOption || matchedOption?.type !== "CHAT") setSelectedChatUser(null);
    }, [pathname]);

    if (authDetails?.user?.role !== "user") return null;


    return (
        
            <main
                className="h-screen w-screen relative flex overflow-hidden"
                style={{
                    background: `linear-gradient(to bottom, #36460A 10%, #000000 40%)`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Sidebar */}
                <SidebarComponent
                    authDetails={authDetails}
                    toogleIsOpen={toggleIsOpen}
                    isMenuOpen={isOpen}
                    contacts={optionList}
                    state={state}
                >
                    {isLoading ? (
                        <div className="flex justify-center items-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-[10px]">
                            {SidebarItemComponent &&
                                optionList?.map((currentOption, idx) => (
                                    <SidebarItemComponent
                                        key={idx}
                                        data={currentOption}
                                        dispatch={dispatch}
                                        state={state}
                                        setIsOpen={setIsOpen}
                                    />
                                ))}
                        </ul>
                    )}

                    <ul className="flex flex-col gap-[10px]">
                        {SidebarItemComponent &&
                            utilOptions?.map((currentOption) => (
                                <SidebarItemComponent
                                    key={currentOption.type}
                                    data={currentOption}
                                    dispatch={dispatch}
                                    state={state}
                                    setIsOpen={setIsOpen}
                                />
                            ))}
                    </ul>
                </SidebarComponent>

                {/* Main content */}
                <div className="flex-1 w-2/3 relative flex bg-transparent flex-col h-full">
                    <NavBar title={state?.title} toogleIsOpen={toggleIsOpen} isMenuOpen={isOpen} user={authDetails?.user} />
                    <div className="w-full h-[92%] overflow-y-auto px-2 lg:px-4 bg-transparent">
                        <DashboardLayout >
                            <Outlet />
                        </DashboardLayout>
                        {children}

                    </div>
                </div>

                {showCall && (
                <Modal isOpen={showCall} closeModal={() => setShowCall(false)}>
                    <CallComponent initialMeetingId={meetingId} setInitialMeetingId={setMeetingId} />
                </Modal>
            )}
            {showSettings &&
                <Modal isOpen={showSettings} closeModal={() => setShowSettings(false)}>
                    <Settings />
                </Modal>
            }
            </main>
    );
};

export default DashboardWrapper;
