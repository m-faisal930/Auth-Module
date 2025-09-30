"use client";




import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {toast, Bounce } from 'react-toastify';

export default function Home() {
    const { logout, user } = useAuth();
    const [isLoggedut, setIsLoggedOut] = useState(false);
    async function handleLogout() {

        await logout();
                   toast.success('Logged out successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        
    }
  return (
    <div className="font-sans text-center mt-10 min-h-screen bg-gray-100 p-5">

      {user &&

      <button onClick={handleLogout} className="bg-blue-500 text-white px-4 py-2 rounded mb-5">
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
