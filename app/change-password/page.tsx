"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast, Bounce } from 'react-toastify';
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

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
        } else {
            toast.error(data.error || "Something went wrong");
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
                                <input
                                    type="password"
                                    name="oldPassword"
                                    id="oldPassword"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="newPassword"
                                    className="block mb-2 text-sm font-medium text-gray-900 "
                                >
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 "
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">

                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-gray-900 hover:bg-gray-700 hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Change Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>






















    </div>;
}   