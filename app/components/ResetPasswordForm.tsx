"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { toast, Bounce } from 'react-toastify';
import Link from "next/link";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        const data = await res.json();


        if (res.ok) {
            toast.success("SPassword reset successful! Redirecting to login...", {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
            setTimeout(() => router.push("/login"), 2000);
        } else {
            toast.error(data.error || "Something went wrong");
        }
    };

    return (
        <div className="bg-gray-50 font-sans">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link
                    href="/"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 "
                >

                    Authontication App
                </Link>
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                            Reset Password
                        </h1>
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="w-full border p-2 rounded mb-4"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="w-full text-white bg-gray-900 hover:bg-gray-700 hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
