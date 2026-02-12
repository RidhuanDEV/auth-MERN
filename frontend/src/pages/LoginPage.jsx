import React from "react";
import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import Input from "../components/Input.jsx";
import { Mail, Loader, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, login, isLoading, isAuthenticated, user, clearError } =
    useAuthStore();
  const navigate = useNavigate();

  // Auto-redirect to profile if user is already authenticated and verified
  // Only check isAuthenticated to minimize dependency changes
  useEffect(() => {
    if (isAuthenticated && user?.isVerified) {
      // Use replace to prevent back button returning to login
      navigate("/profile", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isLoading) return;

    try {
      await login(email, password);
      // Navigation happens automatically via useEffect watching isAuthenticated
    } catch (error) {
      // Error is already set in store, just log for debugging
      console.error("Login failed:", error.message);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Log In
        </h2>
        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            disabled={isLoading}
          />
          <Input
            icon={Lock}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            disabled={isLoading}
          />
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <Link
            to="/forgot-password"
            className="text-green-400 text-sm hover:underline"
          >
            Forgot Password?
          </Link>
          <Motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold
            rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500
            focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.96 }}
            disabled={isLoading || !email || !password}
            type="submit"
          >
            {isLoading ? (
              <Loader
                className="animate-spin mx-auto"
                size={24}
                aria-label="Loading"
              />
            ) : (
              "Log In"
            )}
          </Motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <div className="flex flex-col text-sm text-gray-400">
          <div>
            Do Not Have An Account?{" "}
            <Link to="/signup" className="text-green-400 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </Motion.div>
  );
};

export default LoginPage;
