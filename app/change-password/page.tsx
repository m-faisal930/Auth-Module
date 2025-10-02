"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast, Bounce } from 'react-toastify';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function ChangePasswordPage() {
    const router = useRouter();

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [oldPassword, setOldPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const values = {
            password: String(formData.get("newPassword")),
        };
        const newErrors = validate(values);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }





        const res = await fetch("/api/auth/change-password", {
            method: "PUT",
            body: JSON.stringify({
                oldPassword: formData.get("oldPassword"),
                newPassword: formData.get("newPassword"),
            }),
        });
        const data = await res.json();

        if (res.ok) {
            toast.success("Change Password successful! Redirecting to login...", {
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
    }




    return <div>

        <div className="bg-gray-50 font-sans">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <Link
                    href="/"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 "
                >

                    Authontication App
                </Link>
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 ">
                    <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mt-4 ml-4">
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </Link>
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                            Change your password
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" >
                            <div>
                                <label
                                    htmlFor="oldPassword"
                                    className="block mb-2 text-sm font-medium text-gray-900 "
                                >
                                    Old Password
                                </label>
                                <div className="relative w-full">
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        placeholder="old password"
                                        name="oldPassword"
                                        id="oldPassword"
                                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowOldPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showOldPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                    </button>

                                </div>



                            </div>
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block mb-2 text-sm font-medium text-gray-900 "
                                >
                                    New Password
                                </label>
                                <div className="relative w-full">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="new password"
                                        name="newPassword"
                                        id="newPassword"
                                        className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showNewPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                    </button>

                                </div>

                                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                            </div>
                            <div className="flex items-center justify-between">

                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-gray-900 hover:bg-gray-700 hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >

                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-4 border-white border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
                                    </div>
                                ) : "Change Password"}

                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>






















    </div>;
}   