import { useState, useContext } from "react";
import axiosClient from "../services/axiosClient";
import {AuthContext} from "../context/AuthContext";

const useAuth = () => {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosClient.post("/auth/login", credentials, {
        withCredentials: true, // Ensures the token is sent via secure HTTP-only cookies
      });
      setUser(data.user); // Store user data in memory only
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosClient.post("/auth/register", userData, {
        withCredentials: true,
      });
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosClient.post("/auth/verify-otp", otpData, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axiosClient.post("/auth/logout", {}, { withCredentials: true });
      setUser(null); // Clear user from memory
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return { login, register, verifyOtp, logout, loading, error };
};

export default useAuth;
