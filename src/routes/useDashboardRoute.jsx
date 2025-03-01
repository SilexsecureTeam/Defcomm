import { lazy, Suspense, useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import { DashboardContext } from "../context/DashboardContext";
import { ChatContext } from "../context/ChatContext";
import { dashboardOptions, utilOptions, dashboardTabs } from "../utils/constants";
import useChat from "../hooks/useChat";
import Fallback from "../components/Fallback";

// Lazy load components
const NavBar = lazy(() => import("../components/dashboard/NavBar"));
const SideBar = lazy(() => import("../components/dashboard/SideBar"));
const SideBarTwo = lazy(() => import("../components/dashboard/SideBarTwo"));
const SideBarItem = lazy(() => import("../components/dashboard/SideBarItem"));
const SideBarItemTwo = lazy(() => import("../components/dashboard/SideBarItemTwo"));
const DashboardLayout = lazy(() => import("../layout/DashboardLayout"));
const Home = lazy(() => import("../pages/Dashboard"));
const ChatInterface = lazy(() => import("../pages/ChatInterface"));
const FileManager = lazy(() => import("../pages/FileManager"));
const ComingSoon = lazy(() => import("../pages/ComingSoon"));

function useDashBoardRoute() {
  const { authDetails } = useContext(AuthContext);
  const { setSelectedChatUser } = useContext(ChatContext);
  const { state, dispatch } = useContext(DashboardContext);
  const { fetchContacts } = useChat();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const options = useMemo(() => [...dashboardOptions, ...utilOptions, ...dashboardTabs], []);

  // Sidebar Components (Memoized)
  const SidebarComponent = useMemo(() => (state?.type === "CHAT" ? SideBarTwo : SideBar), [state?.type]);
  const SidebarItemComponent = useMemo(() => (state?.type === "CHAT" ? SideBarItemTwo : SideBarItem), [state?.type]);

  // Fetch contacts when in chat mode
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    enabled: state?.type === "CHAT",
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Update state when route changes
  useEffect(() => {
    const matchedOption = options.find((opt) => pathname === opt.route);
    if (matchedOption) dispatch(matchedOption);

    if (matchedOption?.type === "CHAT") {
      setSelectedChatUser(null);
    }
  }, [pathname, dispatch, options, setSelectedChatUser]);

  // Preload data before navigating
  const preloadData = (route) => {
    if (route === "/chat") {
      queryClient.prefetchQuery(["contacts"], fetchContacts);
    }
  };

  // Handle Navigation
  const handleNavigation = (route) => {
    setIsTransitioning(true);
    navigate(route);
  };

  // Reset transition loader after navigation
  useEffect(() => {
    setIsTransitioning(false);
  }, [pathname]);

  return (
    <>
      {authDetails?.user?.role === "user" ? (
        <main className="h-screen w-screen relative flex overflow-hidden bg-gradient-to-b from-[#36460A] to-black">
          {/* Sidebar with transition loader */}
          <SidebarComponent authDetails={authDetails} toggleIsOpen={() => setIsOpen(!isOpen)} isMenuOpen={isOpen} state={state}>
            {isTransitioning ? (
              <div className="flex justify-center items-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"></div>
              </div>
            ) : (
              <>
                <ul className="flex flex-col gap-[10px]">
                  {(state?.type === "CHAT" ? contacts?.data || [] : dashboardOptions)?.map((option, idx) => (
                    <SidebarItemComponent
                      key={idx}
                      data={option}
                      dispatch={dispatch}
                      state={state}
                      setIsOpen={setIsOpen}
                      onMouseEnter={() => preloadData(option.route)}
                      onClick={() => handleNavigation(option.route)}
                    />
                  ))}
                </ul>

                {/* Utility Options */}
                <ul className="flex flex-col gap-[10px]">
                  {utilOptions.map((option) => (
                    <SidebarItemComponent
                      key={option.type}
                      data={option}
                      dispatch={dispatch}
                      state={state}
                      setIsOpen={setIsOpen}
                      onClick={() => handleNavigation(option.route)}
                    />
                  ))}
                </ul>
              </>
            )}
          </SidebarComponent>

          {/* Main Content */}
          <div className="flex-1 w-2/3 relative flex flex-col h-full">
            <NavBar title={state?.title} toggleIsOpen={() => setIsOpen(!isOpen)} isMenuOpen={isOpen} user={authDetails?.user} />
            <div className="w-full h-[92%] overflow-y-auto px-2 lg:px-4 relative">
              {/* Routes */}
              <Suspense fallback={<Fallback />}>
                <Routes>
                  <Route path="/" element={<DashboardLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/chat" element={<ChatInterface />} />
                    <Route path="/file-sharing" element={<FileManager />} />
                    <Route path="/*" element={<ComingSoon />} />
                  </Route>
                </Routes>
              </Suspense>
            </div>
          </div>
        </main>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
}

export default useDashBoardRoute;
            
