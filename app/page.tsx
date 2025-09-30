"use client";



import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
    const { logout, user } = useAuth();
  return (
    <div className="font-sans text-center mt-10 min-h-screen bg-gray-100 p-5">

      {user &&

      <button onClick={logout} className="bg-blue-500 text-white px-4 py-2 rounded mb-5">
        Logout
      </button>
      }
      { user &&

      <h2 className="text-gray-800 font-bold">Authontication App</h2>
      }
      
      {
        user &&
      <p className="text-gray-500">{user?.email}, welcome!</p>
      }


    </div>
  );
}
