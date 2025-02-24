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
  const { authDetails } = useContext(AuthContext);
  
  const client = axiosClient(authDetails?.token);

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await client.post("/login", credentials);
      if (!data?.data?.user) {
        throw new Error("Invalid response: User data not found");
      }
  
      return data.data; // Return only the user object
    },
    onSuccess: (userData) => {
      if (!userData) {
        return;
      }
      // Store user data in React Query
      queryClient.setQueryData(["authUser"], userData);
      // Store in sessionStorage for persistence
      sessionStorage.setItem("authUser", JSON.stringify(userData));
      // Show success message
      onSuccess({ message: "Login Successful!", success: "Continuing to dashboard" });
      // Navigate to dashboard
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

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      queryClient.clear();
    },
    onSuccess: () => {
     queryClient.invalidateQueries(["authUser"]);
      sessionStorage.clear();
      navigate("/", {replace:true});
      onSuccess({
        message: "Logout successful",
        success: `Logged out ${authDetails?.user?.name}`,
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
