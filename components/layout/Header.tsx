"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PenSquare, User, LogOut } from "lucide-react";
import { toast, Bounce } from "react-toastify";

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!", {
      position: "top-right",
      autoClose: 4000,
      theme: "light",
      transition: Bounce,
    });
  };

  return (
    <div >
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">BlogSpace</h1>
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Button asChild variant="outline">
                    <Link href="/admin">
                      <User className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/admin/blogs/new">
                      <PenSquare className="h-4 w-4 mr-2" />
                      Write
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
