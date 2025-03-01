import { lazy, Suspense, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { DashboardContext } from "../context/DashboardContext";
import { ChatContext } from "../context/ChatContext";
import useChat from "../hooks/useChat";
import { utilOptions, dashboardOptions, dashboardTabs } from "../utils/constants";

const NavBar = lazy(() => import("../components/dashboard/NavBar"));
const SideBarTwo = lazy(() => import("../components/dashboard/SideBarTwo"));
const SideBar = lazy(() => import("../components/dashboard/SideBar"));
const SideBarItem = lazy(() => import("../components/dashboard/SideBarItem"));
const SideBarItemTwo = lazy(() => import("../components/dashboard/SideBarItemTwo"));
const DashboardLayout = lazy(() => import("../layout/DashboardLayout"));
const Home = lazy(() => import("../pages/Dashboard"));
const ChatInterface = lazy(() => import("../pages/ChatInterface"));
const ComingSoon = lazy(() => import("../pages/ComingSoon"));
const FileManager = lazy(() => import("../pages/FileManager"));

function useDashBoardRoute() {
  const { authDetails } = useContext(AuthContext);
  const { setSelectedChatUser } = useContext(ChatContext);
  const { pathname } = useLocation();
  const { fetchContacts } = useChat();
  const { state, dispatch } = useContext(DashboardContext);

  const options = useMemo(() => [...dashboardOptions, ...utilOptions, ...dashboardTabs], []);

  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarLoaded, setIsSidebarLoaded] = useState(false); // NEW: Prevent flash
  const [SidebarComponent, setSidebarComponent] = useState(() => SideBar);
  const [SidebarItemComponent, setSidebarItemComponent] = useState(() => SideBarItem);

  // Fetch Contacts using React Query
  const { data: contacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    enabled: state?.type === "CHAT",
    refetchOnMount: true, 
    refetchOnWindowFocus: true, 
  });

  // Determine sidebar options
  const sidebarOptions = useMemo(() => {
    const matchedOption = options.find((opt) => pathname === opt.route);
    
    if (matchedOption?.type === "CHAT" && contacts?.data?.length) {
      return contacts.data; // Use contacts when available
    }
    return dashboardOptions;
  }, [pathname, contacts?.data, options]);

  useEffect(() => {
    const matchedOption = options.find((opt) => pathname === opt.route);
    
    if (matchedOption) {
      dispatch(matchedOption);
    }

    // Avoid re-render flash by updating once
    setIsSidebarLoaded(false);
    setTimeout(() => {
      if (matchedOption?.type === "CHAT") {
        setSidebarComponent(() => SideBarTwo);
        setSidebarItemComponent(() => SideBarItemTwo);
      } else {
        setSelectedChatUser(null);
        setSidebarComponent(() => SideBar);
        setSidebarItemComponent(() => SideBarItem);
      }
      setIsSidebarLoaded(true);
    }, 50); // Small delay prevents UI flash
  }, [pathname, options]);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  return (
    <>
      {authDetails?.user?.role === "user" ? (
        <main
          className="h-screen w-screen relative flex overflow-hidden"
          style={{
            background: `linear-gradient(to bottom, #36460A 10%, #000000 40%)`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Sidebar */}
          {isSidebarLoaded ? (
            <SidebarComponent authDetails={authDetails} toogleIsOpen={toggleIsOpen} isMenuOpen={isOpen} state={state}>
              {sidebarOptions.length === 0 ? (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
                </div>
              ) : (
                <ul className="flex flex-col gap-[10px]">
                  {sidebarOptions.map((currentOption, idx) => (
                    <SidebarItemComponent key={idx} data={currentOption} dispatch={dispatch} state={state} setIsOpen={setIsOpen} />
                  ))}
                </ul>
              )}

              <ul className="flex flex-col gap-[10px]">
                {utilOptions.map((currentOption) => (
                  <SidebarItemComponent key={currentOption.type} data={currentOption} dispatch={dispatch} state={state} setIsOpen={setIsOpen} />
                ))}
              </ul>
            </SidebarComponent>
          ) : (
            <div className="w-[250px] h-screen bg-gray-900 animate-pulse" />
          )}

          {/* Main Content */}
          <div className="flex-1 w-2/3 relative flex bg-transparent flex-col h-full">
            <NavBar title={state?.title} toogleIsOpen={toggleIsOpen} isMenuOpen={isOpen} user={authDetails?.user} />
            <div className="w-full h-[92%] overflow-y-auto px-2 lg:px-4 bg-transparent">
              <Routes>
                <Route path="/" element={<DashboardLayout />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/chat" element={<ChatInterface />} />
                  <Route path="/file-sharing" element={<FileManager />} />
                  <Route path="/*" element={<ComingSoon />} />
                </Route>
              </Routes>
            </div>
          </div>
        </main>
      ) : (
        <Navigate to={"/login"} replace />
      )}
    </>
  );
}

export default useDashBoardRoute;
