
"use client";

import { useState } from "react";

export default function Signup() {
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    console.log(formData.get("username"));
    console.log(formData.get("email"));
    console.log(formData.get("password"));

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
    setMessage(data.message);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="username" type="text" placeholder="Username" className="border p-2" />
      <input name="email" type="email" placeholder="Email" className="border p-2" />
      <input name="password" type="password" placeholder="Password" className="border p-2" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Signup
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
