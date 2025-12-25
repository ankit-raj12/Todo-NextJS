"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ankit@gmail.com");
  const [password, setPassword] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const data = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }).then((response) => {
      if (response.status === 401) return router.push("/login");
      return response.json();
    });
    if (data.status) return router.push("/");
    setIsLoading(false)
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 bg-gray-50 dark:bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-purple-600 mb-2">
            Todo App
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back! Please login to your account.</p>
        </div>
        
        <div className="bg-white dark:bg-card rounded-xl shadow-lg border border-gray-200 dark:border-border p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-foreground">Login</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-linear-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 hover:shadow-lg transition-all duration-300 ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Do not have an account?{" "}
            <Link href="/register" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
