import { createContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const AuthContext = createContext(null);

const STORAGE_KEY = "authUser";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const [logoutSignal, setLogoutSignal] = useState(false);

  // Read from sessionStorage on mount WITH expiration check
  const [authDetails, setAuthDetails] = useState(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
      const { user, expiresAt } = JSON.parse(stored);

      // Expired → clear silently
      if (!expiresAt || Date.now() > expiresAt) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return user;
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  // React Query cache
  const { data } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => Promise.resolve(authDetails),
    initialData: authDetails,
    staleTime: 0,
  });

  // Sync query data with auth state
  useEffect(() => {
    if (data !== authDetails) {
      setAuthDetails(data);
    }
  }, [data]);

  // Update auth + sessionStorage WITH expiration
  const updateAuth = (newUser) => {
    setAuthDetails(newUser);

    if (newUser) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user: newUser,
          expiresAt: Date.now() + SESSION_DURATION,
        })
      );

      queryClient.setQueryData(["authUser"], newUser);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      queryClient.removeQueries({ queryKey: ["authUser"] });
    }
  };

  return (
    <AuthContext.Provider
      value={{ authDetails, updateAuth, logoutSignal, setLogoutSignal }}
    >
      {children}
    </AuthContext.Provider>
  );
};
