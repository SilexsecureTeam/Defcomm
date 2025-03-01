import { lazy, Suspense, useContext, useEffect, useReducer, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardReducer from "../reducers/DashboardReducer";
import { utilOptions, dashboardOptions, dashboardTabs } from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
import Fallback from "../components/Fallback";
import { DashboardContext } from "../context/DashboardContext";
import useChat from "../hooks/useChat";
import { ChatContext } from "../context/ChatContext";

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
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { fetchContacts } = useChat();
  const { state, dispatch } = useContext(DashboardContext);

  const options = [...dashboardOptions, ...utilOptions, ...dashboardTabs];

  const [SidebarComponent, setSidebarComponent] = useState(() => SideBar);
  const [SidebarItemComponent, setSidebarItemComponent] = useState(() => SideBarItem);
  const [option, setOption] = useState(dashboardOptions);

  // Fetch Contacts using React Query
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    enabled: state?.type === "CHAT", // Fetch only when in chat
    refetchOnMount: false, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when the page is focused
      // refetchOnReconnect: true, // Refetch when the network reconnects
  });

  useEffect(() => {
    const matchedOption = options.find((opt) => pathname === opt.route);
    if (matchedOption) {
      dispatch(matchedOption);
    }

    if (matchedOption?.type === "CHAT") {
      setSidebarComponent(() => SideBarTwo);
      setSidebarItemComponent(() => SideBarItemTwo);
      setOption(contacts?.data || []);
    } else {
      setSelectedChatUser(null); // Clear chat context on unmount
      setSidebarComponent(() => SideBar);
      setSidebarItemComponent(() => SideBarItem);
      setOption(dashboardOptions);
    }
  }, [pathname]);

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
          <SidebarComponent authDetails={authDetails} toogleIsOpen={toggleIsOpen} isMenuOpen={isOpen} state={state}>
            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
              </div>
            ) : (
              <ul className="flex flex-col gap-[10px]">
                {option?.map((currentOption, idx) => (
                  <SidebarItemComponent key={idx} data={currentOption} dispatch={dispatch} state={state} setIsOpen={setIsOpen} />
                ))}
              </ul>
            )}

            <ul className="flex flex-col gap-[10px]">
              {utilOptions?.map((currentOption) => (
                <SidebarItemComponent key={currentOption.type} data={currentOption} dispatch={dispatch} state={state} setIsOpen={setIsOpen} />
              ))}
            </ul>
          </SidebarComponent>

          {/* Main Content */}
          <div className="flex-1 w-2/3 relative flex bg-transparent flex-col h-full">
            <NavBar title={state?.title} toogleIsOpen={toggleIsOpen} isMenuOpen={isOpen} user={authDetails?.user} />
            <div className="w-full h-[92%] overflow-y-auto px-2 lg:px-4 bg-transparent">
              {/* <Suspense fallback={<Fallback />}> */}
                <Routes>
                  <Route path="/" element={<DashboardLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/chat" element={<ChatInterface />} />
                    <Route path="/file-sharing" element={<FileManager />} />
                    <Route path="/*" element={<ComingSoon />} />
                  </Route>
                </Routes>
              {/* </Suspense> */}
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
