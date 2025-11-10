import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";

axios.defaults.withCredentials = true; 

export default function AuthForm({ type, onSuccess, onTypeChange }) {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const endpoint = type === "login" ? "login" : "signup";
      const { data } = await axios.post(
        `https://form-builder-production-cee9.up.railway.app/api/users/${endpoint}`,
        formData,
        { withCredentials: true }
      );

      setMessage(data.msg);
      setTimeout(() => {
        onSuccess(data.username || formData.username);
      }, 500);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {type === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-sm text-gray-600">
          {type === "login"
            ? "Enter your credentials to access your account"
            : "Sign up to start building amazing forms"}
        </p>
      </div>

      <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
        <button
          type="button"
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
            type === "login"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => onTypeChange("login")}
        >
          Login
        </button>
        <button
          type="button"
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
            type === "signup"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => onTypeChange("signup")}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-200 font-semibold shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              {type === "login" ? "Logging in..." : "Signing up..."}
            </>
          ) : (
            <>{type === "login" ? "Login" : "Sign Up"}</>
          )}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-xl text-sm text-center font-medium transition-all duration-300 ${
            message.toLowerCase().includes("success") || message.toLowerCase().includes("welcome")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          {type === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => onTypeChange(type === "login" ? "signup" : "login")}
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition"
            disabled={loading}
          >
            {type === "login" ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
