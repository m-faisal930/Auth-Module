import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans ">
      <h2>Authontication App</h2>
      <p>Sign up, log in, and change your password securely.</p>
        <Link href="/signup" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Signup
        </Link>
      <Link href="/login" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4">
        Login
      </Link>
      <Link href="/change-password" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 ml-4">
        Change Password
      </Link>


    </div>
  );
}
