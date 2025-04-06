import { lazy, Suspense, useContext, useLayoutEffect, useState, useMemo } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { utilOptions, dashboardOptions, dashboardTabs } from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
import { DashboardContext } from "../context/DashboardContext";
import useChat from "../hooks/useChat";
import { ChatContext } from "../context/ChatContext";

// Sidebar Components
import SideBar from "../components/dashboard/SideBar";
import AiSideBar from "../components/dashboard/AiSideBar";
import SideBarTwo from "../components/dashboard/SideBarTwo";
import SideBarItem from "../components/dashboard/SideBarItem";
import SideBarItemTwo from "../components/dashboard/SideBarItemTwo";

import { ThemeProvider } from "../context/ThemeContext";
import Groups from "../pages/Groups";
import ChatBoxTwo from "../pages/ChatBoxTwo";

// Lazy Load Components
const NavBar = lazy(() => import("../components/dashboard/NavBar"));
const DashboardLayout = lazy(() => import("../layout/DashboardLayout"));
const Home = lazy(() => import("../pages/Dashboard"));
const ChatInterface = lazy(() => import("../pages/ChatInterface"));
const ComingSoon = lazy(() => import("../pages/ComingSoon"));
const FileManager = lazy(() => import("../pages/FileManager"));
const DefcommAi = lazy(() => import("../pages/DefcommAi"));
const ChatBox = lazy(() => import("../pages/ChatBox"));
const MyDrive = lazy(() => import("../pages/MyDrive"));
const DriveContent = lazy(() => import("../pages/DriveContent"));
const Settings = lazy(() => import("../pages/Settings"));
const ContactPage = lazy(() => import("../pages/ContactList"));
const WalkieTalkie= lazy(() => import("../pages/WalkieTalkie"));
const DeffViewer= lazy(() => import("../pages/DeffViewer"));

function useDashBoardRoute() {
  const { authDetails } = useContext(AuthContext);
  const { setSelectedChatUser } = useContext(ChatContext);
  const { pathname } = useLocation();
  const { fetchContacts } = useChat();
  const { state, dispatch } = useContext(DashboardContext);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch Contacts using React Query
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    enabled: state?.type === "CHAT", // Fetch only when in chat mode
    staleTime: 0,
  });

  // Memoized Sidebar Configuration
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

  // Handle Route Dispatch & Reset Chat User
  useLayoutEffect(() => {
    const matchedOption = [...dashboardOptions, ...utilOptions, ...dashboardTabs].find((opt) => pathname === opt.route);
    if (matchedOption) {
      dispatch(matchedOption);
    }
    if (!matchedOption || matchedOption?.type !== "CHAT") {
      setSelectedChatUser(null);
    }
  }, [pathname]);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  return (
    <>
      {authDetails?.user?.role === "user" ? (
        <ThemeProvider>
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
                      <SidebarItemComponent key={idx} data={currentOption} dispatch={dispatch} state={state} setIsOpen={setIsOpen} />
                    ))}
                </ul>
              )}

              <ul className="flex flex-col gap-[10px]">
                {SidebarItemComponent &&
                  utilOptions?.map((currentOption) => (
                    <SidebarItemComponent key={currentOption.type} data={currentOption} dispatch={dispatch} state={state} setIsOpen={setIsOpen} />
                  ))}
              </ul>
            </SidebarComponent>

            {/* Main Content */}
            <div className="flex-1 w-2/3 relative flex bg-transparent flex-col h-full">
              <NavBar title={state?.title} toogleIsOpen={toggleIsOpen} isMenuOpen={isOpen} user={authDetails?.user} />
              <div className="w-full h-[92%] overflow-y-auto px-2 lg:px-4 bg-transparent">
                <Routes>
                  <Route path="/" element={<DashboardLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/chat" element={<ChatInterface />} />
                    <Route path="/new-file" element={<DeffViewer />} />
                    <Route path="/file-view/:fileUrl" element={<DeffViewer />} />
                    <Route path="/contacts" element={<ContactPage />} />
                    <Route path="/file-sharing" element={<FileManager />} />
                    <Route path="/groups" element={<Groups />} />
                    <Route path="/comm" element={<WalkieTalkie />} />
                    <Route path="/drive" element={<MyDrive />} />
                    <Route path="/drive/:id" element={<DriveContent />} />
                    <Route path="/isurvive" element={<DefcommAi />} />
                    <Route path="/isurvive/chat" element={<ChatBox />} />
                    <Route path="/isurvive/voice" element={<ChatBoxTwo />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/*" element={<ComingSoon />} />
                  </Route>
                </Routes>
              </div>
            </div>
          </main>
        </ThemeProvider>
      ) : (
        <Navigate to={"/login"} replace />
      )}
    </>
  );
}

export default useDashBoardRoute;
