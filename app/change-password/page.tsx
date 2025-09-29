"use client";

import { useState } from "react";

export default function ChangePasswordPage() {
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        // ✅ Get token from localStorage
        const token = localStorage.getItem("token");

        const res = await fetch("/api/auth/change-password", {
            method: "PUT",
            body: JSON.stringify({
                oldPassword: formData.get("oldPassword"),
                newPassword: formData.get("newPassword"),
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // ✅ Attach token here
            },
        });
        const data = await res.json();
        setMessage(data.message || data.error);
    }




    return <div>C
        Change Password Page
        <form onSubmit={handleSubmit} className="space-y-3">
            <input name="oldPassword" type="password" placeholder="Old Password" className="border p-2" />
            <input name="newPassword" type="password" placeholder="New Password" className="border p-2" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Change Password
            </button>
            {message && <p>{message}</p>}
        </form>




    </div>;
}   