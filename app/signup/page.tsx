
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Bounce } from 'react-toastify';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Signup() {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    function validate(values: { username: string; email: string; password: string }) {
        const newErrors: { [key: string]: string } = {};

        if (!values.username) {
            newErrors.username = "Username is required";
        } else if (values.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(values.username)) {
            newErrors.username = "Username can only contain letters, numbers, and underscores";
        }

        if (!values.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            newErrors.email = "Invalid email format";
        }


        if (!values.password) {
            newErrors.password = "Password is required";
        } else if (values.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])/.test(values.password)) {
            newErrors.password = "Password must contain letters and numbers";
        }

        return newErrors;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);



        const values = {
            username: String(formData.get("username")),
            email: String(formData.get("email")),
            password: String(formData.get("password")),
        };


        const newErrors = validate(values);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }


        const res = await fetch("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify({
                username: formData.get("username"),
                email: formData.get("email"),
                password: formData.get("password"),
            }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (res.ok) {
            toast.success("Signed up successfully!", {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
            router.push("/login");
            setLoading(false);
        } else {
            toast.error(data.error || "Something went wrong");
            setLoading(false);
        }

    }

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
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Sign up to your account
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" >
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block mb-2 text-sm font-medium text-gray-900 "
                                >
                                    Your username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 "
                                    placeholder="username"
                                    required
                                />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5"
                                    placeholder="name@company.com"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 "
                                >
                                    Password
                                </label>
                                <div className="relative w-full">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="password"
                                        name="password"
                                        id="password"
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
                            </div>

                            <button

                                type="submit"
                                className="w-full text-white bg-gray-900 hover:bg-gray-700 hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >






                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-4 border-t-4 border-gray-200 rounded-full animate-spin mx-auto"></div>
                                    </div>
                                ) : (
                                    "Create an account"
                                )}
                            </button>



                            <p className="text-sm font-light text-gray-500">
                                Already have account?{" "}
                                <Link
                                    href="/login"
                                    className="font-medium text-gray-600 hover:underline "
                                >
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
