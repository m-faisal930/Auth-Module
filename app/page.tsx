"use client";

import { useAuth } from "@/context/AuthContext";
import { toast, Bounce } from "react-toastify";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { logout, user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  async function handleLogout() {
    await logout();
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 4000,
      theme: "light",
      transition: Bounce,
    });
  }

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen p-8`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => toggleDarkMode()}
          className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div
        className={`max-w-md mx-auto shadow-md rounded-xl p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"} `}
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <h2
              className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {user?.username || "User"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/change-password"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-600"
          >
            Change Password
          </Link>
          <Link
            href="/profile"
            className="bg-green-500 text-white px-4 py-2 rounded-lg text-center hover:bg-green-600"
          >
            Edit Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div
        className={`max-w-md mx-auto mt-8 grid grid-cols-2 gap-4 ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"}`}
      >
        <div className="p-4 rounded-lg shadow text-center ">
          <p className="text-sm ">Last Login</p>
          <p className="font-bold">Today</p>
        </div>
        <div className="p-4 rounded-lg shadow text-center ">
          <p className="text-sm ">Account Created</p>
          <p className="font-bold">3 days Ago</p>
        </div>
      </div>
    </div>
  );
}
