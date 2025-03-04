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
      console.log(data)
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
      const { data } = await client.post("/register", userData);
      return data;
    },
    onSuccess: () => {
      onSuccess({ message: "Registration Successful!", error: "" });
    },
    onError: (err) => {
      console.log("Registration error:", err); // Debugging
      onFailure({ message: "Registration Failed", error: err.response?.data?.message || err.message });
    },
  });

  // Verify OTP Mutation
  const requestOtpMutation = useMutation({
    mutationFn: async (credential) => {
      const { data } = await client.post("/requestOtpSms", { phone: credential?.phone });
      if (data?.status !== 200) {
        throw new Error("An error occured");
      }
      return data;
    },
    onSuccess: (data) => {
      onSuccess({ message: "OTP Requested!", success: `Here is your OTP- ${data?.otp}`|| data?.message })
    },
    onError: (err) => {
      onFailure({ message: "Login Failed", error: err?.response?.data?.error || err?.response?.data?.message || err?.message });
    },
  });
  // Verify OTP Mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async (otpData) => {
      
      const { data } = await client.post("/loginWithPhone", otpData);
      if (data?.status !== 200) {
        throw new Error("Invalid response: User data not found");
      }
      return data.data;
    },
    onSuccess: (userData) => {
      updateAuth(userData);
      navigate("/dashboard/home");
      onSuccess({ message: "OTP Verified!", success: "Continuing to dashboard" });
    },
    onError: (err) => {
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
  const isLoading = {
    login: loginMutation.isPending,
    register: registerMutation.isPending,
    requestOtp: requestOtpMutation.isPending,
    verifyOtp: verifyOtpMutation.isPending,
    logout: logoutMutation.isPending,
    overall:
      loginMutation.isPending ||
      registerMutation.isPending ||
      requestOtpMutation.isPending ||
      verifyOtpMutation.isPending ||
      logoutMutation.isPending,
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    verifyOtp: verifyOtpMutation.mutate,
    requestOtp: requestOtpMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoading,
  };
};

export default useAuth;
