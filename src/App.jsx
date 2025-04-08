import { Suspense, lazy, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import FallBack from "./components/Fallback";
import { DashboardContextProvider } from "./context/DashboardContext";
import { queryClient } from "./services/query-client";
import { ChatProvider } from "./context/ChatContext";
import { BotProvider } from "./context/BotContext";

// Lazy load components
const DefcommLogin = lazy(() => import("./pages/DefcommLogin"));
const Dashboard = lazy(() => import("./routes/useDashboardRoute"));
const DeffViewer = lazy(() => import("./pages/DeffViewer"));


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <BotProvider>
            <DashboardContextProvider>
              <Suspense fallback={<FallBack />}>
                <Router>
                  <Routes>
                    <Route path="/login" element={<DefcommLogin />} />
                    <Route path="web" element={<DeffViewer />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                    {/* Using ProtectedRoute as a Component */}
                    <Route path="/dashboard/*" element={<ProtectedRoute Component={Dashboard} />} />

                    {/* Catch-all redirect */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Router>
              </Suspense>
              <ToastContainer autoClose={2000} draggable className="z-[100000000000] mt-2" />
            </DashboardContextProvider>
          </BotProvider>
        </ChatProvider>
      </AuthProvider>

      {/* Show DevTools only in development mode */}
      {import.meta.env.VITE_MODE === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="right" />
      )}
    </QueryClientProvider>
  );
};

// Protected Route Wrapper as a Component
const ProtectedRoute = ({ Component }) => {
  const { authDetails, isLoading } = useContext(AuthContext);
  if (isLoading) return <div className="text-white text-center mt-10">Loading...</div>;
  // Check if the user role is "user"
  if (!authDetails || authDetails.user?.role !== "user") {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default App;
