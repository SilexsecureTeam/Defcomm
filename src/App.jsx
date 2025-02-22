import { Suspense, lazy, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import FallBack from "./components/Fallback";
import { DashboardContextProvider } from "./context/DashboardContext";  // Import DashboardContext

// Lazy load components
const DefcommLogin = lazy(() => import("./pages/DefcommLogin"));
const Dashboard = lazy(() => import("./routes/useDashboardRoute")); // Ensure this component exists

const App = () => {
  return (
    <AuthProvider>
      <DashboardContextProvider >
      <Suspense fallback={<FallBack />}>
        <Router>
          <Routes>
            <Route path="/" element={<DefcommLogin />} />

            <Route path="/dashboard/*" element={<Dashboard />} />

            {/* <ProtectedRoute Component={Dashboard} /> */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </Suspense>
      <ToastContainer autoClose={2000} draggable />
    </DashboardContextProvider>
    </AuthProvider >
  );
};

// Protected Route Wrapper (Fixed for JavaScript)
const ProtectedRoute = ({ Component }) => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  return authenticated ? <Component /> : <Navigate to="/" />;
};

export default App;
