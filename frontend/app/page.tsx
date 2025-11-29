"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    username: string;
    password: string;
    general: string;
  }>({
    username: "",
    password: "",
    general: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "", general: "" });
  };

  const validateSignup = () => {
    const newErrors: any = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors({ ...errors, ...newErrors });

    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateSignup()) return;

    try {
      setLoading(true);

      await axios.post("http://127.0.0.1:8000/auth/signup", form);

      alert("Signup successful! Please login.");
      router.push("/login");

    } catch (err: any) {
      setErrors({
        ...errors,
        general: err?.response?.data?.detail || "Signup failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-600 text-center">
          Create Account
        </h2>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Choose a username"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Minimum 6 characters"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm">{errors.general}</p>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full py-3 mt-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?
            <button
              onClick={() => router.push("/login")}
              className="text-purple-600 font-semibold ml-1 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
