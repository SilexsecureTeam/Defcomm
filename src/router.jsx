// src/router.jsx
import { Suspense, lazy, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FallBack from "./components/Fallback";
import { AuthContext } from "./context/AuthContext";

// Lazy loaded routes
const DefcommLogin = lazy(() => import("./pages/DefcommLogin"));
const Dashboard = lazy(() => import("./routes/DashboardRoutes"));
const DeffViewer = lazy(() => import("./pages/DeffViewer"));
const SecureChatUI = lazy(() => import("./pages/SecureChatUI"));
const ChatInterface = lazy(() => import("./pages/ChatInterface"));
const SecureRoute = lazy(() => import("./routes/SecureRoute"));

// 🔒 Wrapper to protect routes by role
const ProtectedRoute = ({ children, allowedRoles = ["user"] }) => {
  const { authDetails, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  if (!authDetails || !allowedRoles.includes(authDetails.user?.role)) {
    // Always use relative paths
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Suspense fallback={<FallBack />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<DefcommLogin />} />
        <Route path="/login" element={<DefcommLogin />} />
        <Route path="/onboarding" element={<DefcommLogin />} />
        <Route path="/web" element={<DeffViewer />} />

        {/* Secure dashboard routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <SecureRoute />
            </ProtectedRoute>
          }
        >
          {/* Nested dashboard routes */}
          <Route path="*" element={<Dashboard />} />
        </Route>

        {/* Secure chat routes (example) */}
        <Route
          path="/chat/*"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <SecureRoute />
            </ProtectedRoute>
          }
        >
          <Route path="interface" element={<ChatInterface />} />
          <Route path="secure" element={<SecureChatUI />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
