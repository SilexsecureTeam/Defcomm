import { Suspense, lazy, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";

// Lazy load components
const DefcommLogin = lazy(() => import("./pages/DefcommLogin"));
const Dashboard = lazy(() => import("./pages/Dashboard")); // Ensure this component exists

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
          <Routes>
            <Route path="/" element={<DefcommLogin />} />
            <Route path="/dashboard" element={<ProtectedRoute Component={Dashboard} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
};

// Protected Route Wrapper (Fixed for JavaScript)
const ProtectedRoute = ({ Component }) => {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  return authenticated ? <Component /> : <Navigate to="/" />;
};

export default App;
