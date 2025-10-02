"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/auth/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();


        if (res.ok) {
            setMessage("Reset link sent! Check your email.");
            setLoading(false);
        } else {
            setMessage(data.error || "Something went wrong.");
            setLoading(false);
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
                    <Link href="/login" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mt-4 ml-4">
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </Link>
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2x">
                            Forgot Password
                        </h1>
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96 text-gray-800">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full border p-2 rounded mb-4"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="w-full text-white bg-gray-900 hover:bg-gray-700 hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-4 border-white border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
                                    </div>
                                ) : "Send Reset Link"}
                            </button>
                            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}
