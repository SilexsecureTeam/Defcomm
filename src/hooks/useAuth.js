import { useContext, useEffect, useState } from "react";
import {axiosClient} from "../services/axios-client";
import {AuthContext} from "../context/AuthContext";
import { FormatError } from "../utils/formmaters";
import { onFailure } from "../utils/notifications/OnFailure";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { useNavigate } from "react-router-dom";
const useAuth = () => {
  const navigate=useNavigate();
  const { setAuthDetails, authDetails } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    message: "",
    error: "",
  });
  const client=axiosClient(authDetails?.token)

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await client.post("/login", credentials);
      console.log(data)
      setAuthDetails(data.user); // Store user data in memory only
      navigate('/dashboard/home');
    } catch (err) {
      //setError(err.response?.data?.message || "Login failed");
      console.log(err)
      FormatError(err, setError, "Login Error");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await client.post("/register", userData);
      setAuthDetails(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otpData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await client.post("/verify-otp", otpData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await client.post("/logout", {}, { withCredentials: true });
      setAuthDetails(null); // Clear user from memory
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    //console.log(error)
    if (error?.message && error?.error) {
      onFailure(error);
    }
  }, [error]);

  return { login, register, verifyOtp, logout, isLoading, error };
};

export default useAuth;
