
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


export default function Login() {
    const router = useRouter();
    const { setUser } = useAuth();
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (data.message) {
      setMessage(data.message);
      console.log(message)
        setUser(data.user);
      router.push("/"); 
    } else {
      setMessage(data.error || "Login failed");
    }
  }

  return (

<>
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
          Sign in to your account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6" >
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 "
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
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 "
              required
            />
          </div>
          <div className="flex items-center justify-between">

            <Link
              href="#"
              className="text-sm font-medium text-gray-600 hover:underline "
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-gray-900 hover:bg-gray-700 hover:cursor-pointer focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Sign in
          </button>
          <p className="text-sm font-light text-gray-500">
            Don’t have an account yet?{" "}
            <Link
              href="/signup"
              className="font-medium text-gray-600 hover:underline "
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  </div>
</div>
</>

  );
}

