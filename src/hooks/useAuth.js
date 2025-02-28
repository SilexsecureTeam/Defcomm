import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Ensure this is from @tanstack/react-query
import { useNavigate } from "react-router-dom";
import { axiosClient } from "../services/axios-client";
import { AuthContext } from "../context/AuthContext";
import { onFailure } from "../utils/notifications/OnFailure";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { queryClient } from "../services/query-client";
const useAuth = () => {
  const navigate = useNavigate();
  const { authDetails, updateAuth } = useContext(AuthContext);
  
  const client = axiosClient(authDetails?.token);

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await client.post("/login", credentials);
      if (!data?.data?.user) {
        throw new Error("Invalid response: User data not found");
      }
      return data.data;
    },
    onSuccess: (userData) => {
      updateAuth(userData); // Immediately update auth state
      onSuccess({ message: "Login Successful!", success: "Continuing to dashboard" });
      navigate("/dashboard/home");
    },
    onError: (error) => {
      onFailure({ message: "Login Failed", error: error.response?.data?.message || error?.message });
    },
  });
  
  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      console.log("Registering user..."); // Debugging
      const { data } = await client.post("/register", userData);
      return data;
    },
    onSuccess: () => {
      console.log("Registration successful!"); // Debugging
      onSuccess({ message: "Registration Successful!", error: "" });
    },
    onError: (err) => {
      console.log("Registration error:", err); // Debugging
      onFailure({ message: "Registration Failed", error: err.response?.data?.message || err.message });
    },
  });

  // Verify OTP Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async (otpData) => {
      console.log("Verifying OTP..."); // Debugging
      const { data } = await client.post("/verify-otp", otpData);
      return data;
    },
    onSuccess: () => {
      console.log("OTP verification successful!"); // Debugging
      onSuccess({ message: "OTP Verified!", error: "" });
    },
    onError: (err) => {
      console.log("OTP verification failed:", err); // Debugging
      onFailure({ message: "OTP Verification Failed", error: err.response?.data?.message || err.message });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      queryClient.clear(); // Clear all cached data
    },
    onSuccess: () => {
      updateAuth(null); // Reset auth state
      navigate("/", { replace: true });
      onSuccess({
        message: "Logout successful",
        success: "You have been logged out.",
      });
    },
    onError: (err) => {
      onFailure({ message: "Logout Failed", error: err.message });
    },
  });

  // Check if any mutation is loading
  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    verifyOtpMutation.isPending ||
    logoutMutation.isPending;
  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading,
  };
};

export default useAuth;
