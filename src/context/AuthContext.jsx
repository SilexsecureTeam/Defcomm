import { createContext, useState, useEffect } from "react";
import {axiosClient} from "../services/axios-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authDetails, setAuthDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Fetch authDetails only once when app loads
  useEffect(() => {
    const fetchauthDetails = async () => {
      try {
        const { data } = await axiosClient.get("/auth/me", {
          withCredentials: true, // Secure session handling
        });
        setAuthDetails(data.authDetails);
        setAuthenticated(true);
      } catch (error) {
        setAuthDetails(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchauthDetails();
  }, []);

  return (
    <AuthContext.Provider value={{ authDetails, setAuthDetails, authenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

