import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { onFailure } from "../utils/notifications/OnFailure";

const LoginForm = ({ version }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onChange", // Validates as the user types
    });
    const { requestOtp, verifyOtp, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [otpRequested, setOtpRequested] = useState(false);
    const [otp, setOtp] = useState("");
    const [userData, setUserData] = useState(null);
    const [timer, setTimer] = useState(60); // Countdown starts at 60 seconds

    useEffect(() => {
        let interval;
        if (otpRequested && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTime) => prevTime - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpRequested, timer]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data) => {
        const response = await requestOtp(data);
        if (response) {
            console.log(response);
            setUserData(data);
            setOtpRequested(true);
            setTimer(60); // Reset timer when OTP is requested
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length === 4 && userData) {
            await verifyOtp({ ...userData, otp });
        }
    };

    const handleResendOtp = async () => {
        if (userData) {
            await requestOtp(userData);
            setOtp(""); // Reset OTP field
            setTimer(60); // Restart countdown
        }
    };

    return (
        <div
            id="login-form"
            className="w-full max-w-[780px] flex justify-center lg:justify-end items-center pt-20"
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white text-black p-8 rounded-2xl shadow-xl w-[350px] flex flex-col justify-between"
            >
                {!otpRequested ? (
                    <>
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Sign in With Defcomm account
                        </h2>
                        <input
                            {...register("phone", {
                                required: "Phone number is required",
                                pattern: {
                                    value: /^(070|080|081|090|091)\d{8}$/,
                                    message: "Invalid Nigerian phone number",
                                },
                            })}
                            type="text"
                            placeholder="Enter Phone Number"
                            className="w-full p-3 border border-gray-600 rounded-md"
                            maxLength={11}
                        />
                        {errors?.phone && <p className="text-red-500 text-sm">{errors?.phone?.message}</p>}
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
                                    <FaSpinner className="animate-spin mr-2" />{" "}
                                    Sending OTP...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </>
                ) : (
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-center">
                            Two Factor Authentication
                        </h2>
                        <OtpInput
                            value={otp}
                            onChange={(value) => {
                                // Allow only numbers
                                if (/^\d*$/.test(value)) {
                                    setOtp(value);
                                }
                                return;
                            }}
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
                            renderInput={(props) => <input {...props} inputMode="numeric" pattern="\d*" />}
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
                                        <FaSpinner className="animate-spin mr-2" />{" "}
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify OTP"
                                )}
                            </button>

                            {/* Show resend button only when timer reaches 0 */}
                            {timer === 0 ? (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={isLoading?.requestOtp || timer !== 0}
                                    className="mt-3 w-full bg-black hover:bg-gray-800 text-white p-3 rounded-md flex justify-center items-center disabled:cursor-not-allowed disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isLoading?.requestOtp ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />{" "}
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
                    </div>
                )}
            </form>
        </div>
    );
};

export default LoginForm;
