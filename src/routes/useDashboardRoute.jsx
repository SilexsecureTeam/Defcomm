import { lazy, Suspense, useContext, useEffect, useReducer, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import DashboardReducer from "../reducers/DashboardReducer";
import { contactList, utilOptions, dashboardOptions, dashboardTabs } from "../utils/constants";
import { AuthContext } from "../context/AuthContext";
import Fallback from "../components/Fallback";
import { DashboardContext } from "../context/DashboardContext";  // Import DashboardContext

const NavBar = lazy(() =>
  import("../components/dashboard/NavBar").catch(() => ({ default: () => <div>Error loading NavBar</div> }))
);
const SideBarTwo = lazy(() =>
  import("../components/dashboard/SideBarTwo").catch(() => ({ default: () => <div>Error loading Sidebar</div> }))
);

const SideBar = lazy(() =>
  import("../components/dashboard/SideBar").catch(() => ({ default: () => <div>Error loading Sidebar</div> }))
);
const SideBarItem = lazy(() =>
  import("../components/dashboard/SideBarItem").catch(() => ({ default: () => <div>Error loading SidebarItem</div> }))
);
const SideBarItemTwo = lazy(() =>
  import("../components/dashboard/SideBarItemTwo").catch(() => ({
    default: () => <div>Error loading SidebarItemTwo</div>,
  }))
);

const DashboardLayout = lazy(() =>
  import("../layout/DashboardLayout").catch(() => ({ default: () => <div>Error loading Layout</div> }))
);
const Home = lazy(() =>
  import("../pages/Dashboard").catch(() => ({ default: () => <div>Error loading Home</div> }))
);
const ChatInterface = lazy(() =>
  import("../pages/ChatInterface").catch(() => ({ default: () => <div>Error loading Chat</div> }))
);
const ComingSoon = lazy(() =>
  import("../pages/ComingSoon").catch(() => ({ default: () => <div>Error loading ComingSoon</div> }))
);
const FileManager = lazy(() =>
  import("../pages/FileManager").catch(() => ({ default: () => <div>Error loading ComingSoon</div> }))
);
function useDashBoardRoute() {
  const { authDetails } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const options = [...dashboardOptions, ...utilOptions, ...dashboardTabs];
  const { state, dispatch } = useContext(DashboardContext);  // Access state and dispatch from RouterContext
  const [SidebarComponent, setSidebarComponent] = useState(() => SideBar); // Default sidebar
  const [SidebarItemComponent, setSidebarItemComponent] = useState(() => SideBarItem); // Default sidebar
  const [option, setOption] = useState(dashboardOptions); // Default sidebar
 
  // Handle Sidebar change based on route
  useEffect(() => {
    const matchedOption = options.find((opt) => pathname===opt.route);
    if (matchedOption) {
      dispatch(matchedOption);
    } 

    if (matchedOption?.type === "CHAT") {
      setSidebarComponent(() => SideBarTwo);
      setSidebarItemComponent(() => SideBarItemTwo);
      setOption(contactList)
    } else {
      setSidebarComponent(() => SideBar);
      setSidebarItemComponent(() => SideBarItem);
      setOption(dashboardOptions)
    }
    console.log(options, state)
  }, [pathname]);

  const toggleIsOpen = () => setIsOpen(!isOpen);

  return (
    <>
      {true ? (
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
            state={state}
          >
            <ul className="flex flex-col gap-[10px]">
              {option.map((currentOption) => (
                <SidebarItemComponent
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

          {/* Main Content */}
          <div className="flex-1 w-2/3 relative flex bg-transparent flex-col h-full">
            <NavBar
              title={state?.title}
              toogleIsOpen={toggleIsOpen}
              isMenuOpen={isOpen}
              user={authDetails?.user}
            />
            <div className="w-full h-[92%] overflow-y-auto px-2 lg:px-4 bg-transparent">
              {/*<Suspense fallback={<Fallback />}>*/}
                <Routes>
                  <Route path="/" element={<DashboardLayout />} >
                    <Route path="/home" element={<Home />} />
                    <Route path="/chat" element={<ChatInterface />} />
                    <Route path="/file-sharing" element={<FileManager />} />
                    <Route path="/*" element={<ComingSoon />} />
                  </Route>
                </Routes>
              {/*</Suspense>*/}
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
