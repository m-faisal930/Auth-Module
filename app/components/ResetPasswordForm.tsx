"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast, Bounce } from 'react-toastify';
import Link from "next/link";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    function validate(values: { password: string }) {
        const newErrors: { [key: string]: string } = {};

        if (!values.password) {
            newErrors.password = "Password is required";
        } else if (values.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(values.password)) {
            newErrors.password = "Password must contain letters and numbers";
        }

        return newErrors;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const newErrors = validate({ password });
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        const data = await res.json();

        if (res.ok) {
            toast.success("Password reset successful! Redirecting to login...", {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
            setTimeout(() => router.push("/login"), 2000);
            setLoading(false);
        } else {
            toast.error(data.error || "Something went wrong");
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 font-sans">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
                    Authontication App
                </Link>
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                            Reset Password
                        </h1>
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">


                            <div className="relative w-full">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                            <button
                                type="submit"
                                className="mt-4 w-full text-white bg-gray-900 hover:bg-gray-700 hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-4 border-white border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
                                    </div>
                                ) : "Reset Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

