import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { FaSpinner } from "react-icons/fa";
import OtpInput from "react-otp-input";
import useAuth from "../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const LoginForm = ({ version }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.fromLogout
    ? "/dashboard/home"
    : location.state?.from?.pathname || "/dashboard/home";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    mode: "onChange",
  });

  const { requestOtp, verifyOtp, isLoading } = useAuth();

  const [otpRequested, setOtpRequested] = useState(false);
  const [otp, setOtp] = useState("");
  const [userData, setUserData] = useState(null);
  const [timer, setTimer] = useState(60);
  const [selectedCountry, setSelectedCountry] = useState("ng"); // default to Nigeria

  const phone = watch("phone");

  useEffect(() => {
    let interval;
    if (otpRequested && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpRequested, timer]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      phone: "+" + data.phone, // Add + before sending
    };
    const response = await requestOtp(formattedData);
    if (response) {
      setUserData(data);
      setOtpRequested(true);
      setTimer(60);
    }
  };
  const handleVerifyOtp = async () => {
    if (otp.length === 4 && userData) {
      await verifyOtp({ ...userData, otp, from });
    }
  };

  const handleResendOtp = async () => {
    if (userData) {
      await requestOtp(userData);
      setOtp("");
      setTimer(60);
    }
  };

  return (
    <div className="w-full max-w-[780px] flex justify-center lg:justify-end items-center pt-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white text-black p-8 rounded-2xl shadow-xl w-[350px] flex flex-col justify-between"
      >
        {!otpRequested ? (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Sign in With Defcomm account
            </h2>

            {/* PHONE INPUT WITH COUNTRY CODE */}
            <PhoneInput
              country={selectedCountry}
              value={phone}
              onChange={(phone, countryData, e, formattedValue) => {
                setValue("phone", phone, { shouldValidate: true });
                setSelectedCountry(countryData?.countryCode || "ng"); // fallback to ng
                trigger("phone"); // to manually trigger validation
              }}
              inputProps={{
                name: "phone",
                required: true,
              }}
              inputStyle={{ width: "100%", height: "40px" }}
              containerStyle={{ marginBottom: "10px", height: "40px" }}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}

            {/* Hidden field to register phone with validation */}
            <input
              type="hidden"
              {...register("phone", {
                required: "Phone number is required",
                validate: (value) => {
                  if (!value || value.trim() === "") {
                    return "Phone number is required";
                  }
                  if (!isValidPhoneNumber("+" + value)) {
                    return "Invalid phone number for selected country";
                  }
                  return true;
                },
              })}
            />

            <div className="flex justify-between items-center text-sm mt-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="text-green-700">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-oliveLight hover:bg-oliveDark text-white p-3 rounded-md flex justify-center items-center"
              disabled={isLoading?.requestOtp}
            >
              {isLoading?.requestOtp ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Sending OTP...
                </>
              ) : (
                "Login"
              )}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Two Factor Authentication
            </h2>

            <OtpInput
              value={otp}
              onChange={(value) => /^\d*$/.test(value) && setOtp(value)}
              numInputs={4}
              isInputNum
              containerStyle="flex justify-center gap-2 mb-4"
              inputStyle={{
                background: "#36460A",
                borderRadius: "10px",
                color: "white",
                width: "50px",
                fontSize: "25px",
                height: "50px",
              }}
              shouldAutoFocus
              renderInput={(props) => <input {...props} inputMode="numeric" />}
            />

            <div className="mt-10 font-medium">
              <button
                type="button"
                disabled={isLoading?.verifyOtp || timer === 0}
                onClick={handleVerifyOtp}
                className="mt-3 w-full bg-oliveLight hover:bg-oliveDark text-white p-3 rounded-md flex justify-center items-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading?.verifyOtp ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>

              {timer === 0 ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="mt-3 w-full bg-black hover:bg-gray-800 text-white p-3 rounded-md flex justify-center items-center"
                  disabled={isLoading?.requestOtp}
                >
                  {isLoading?.requestOtp ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Resending...
                    </>
                  ) : (
                    "Resend code to device"
                  )}
                </button>
              ) : (
                <p className="mt-4 text-center text-gray-600">
                  Resend OTP in {timer}s
                </p>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
