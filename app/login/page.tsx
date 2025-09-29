
"use client";

import { useState } from "react";

export default function Login() {
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

    if (data.token) {
      localStorage.setItem("token", data.token);
      setMessage("Login successful!");
    } else {
      setMessage(data.error || "Login failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="email" type="email" placeholder="Email" className="border p-2" />
      <input name="password" type="password" placeholder="Password" className="border p-2" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Login
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
