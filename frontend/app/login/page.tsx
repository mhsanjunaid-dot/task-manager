"use client";

import { useState } from "react";
import { loginUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const extractError = (err: any) => {
  const detail = err?.response?.data?.detail;

  if (!detail) return "Something went wrong";

  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg).join(", ");
  }

  if (typeof detail === "object") {
    return detail.msg || JSON.stringify(detail);
  }

  return String(detail);
};


    try {
  const data = await loginUser(username, password);

  localStorage.setItem("accessToken", data.access_token);

  router.push("/dashboard");

} catch (err: any) {
  setError(extractError(err));
}
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-100 to-purple-100">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/50">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Welcome Back 👋
        </h1>

        {error && (
          <p className="mb-3 text-center text-red-500 text-sm">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full p-3 border rounded-xl bg-gray-50"
              placeholder="your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-xl bg-gray-50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-xl"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Don’t have an account?
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-purple-600 font-semibold ml-1 hover:underline"
            >
              Sign Up
            </button>
          </p>

        </form>
      </div>
    </div>
  );
}
