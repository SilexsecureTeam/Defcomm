import { createContext, useState, useEffect } from "react";
import axiosClient from "../services/axiosClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Fetch user only once when app loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosClient.get("/auth/me", {
          withCredentials: true, // Secure session handling
        });
        setUser(data.user);
        setAuthenticated(true);
      } catch (error) {
        setUser(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

