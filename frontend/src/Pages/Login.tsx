import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const Submit = async () => {
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/user/login", { email, password }, { withCredentials: true });
      console.log("User logged in:", res.data);

      setEmail("");
      setPassword("");
      setError("");

      navigate("/");
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <>
            <div className="absolute -top-24 -left-24 w-44 h-44 bg-purple-500 rounded-full opacity-20 rotate-45 animate-pulse-slow"></div>
        <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-pink-500 rounded-full opacity-15 rotate-12 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-purple-700/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full flex flex-col gap-6">
          <h1 className="text-4xl font-extrabold text-white text-center tracking-wide">Login to SnapStack</h1>
  
          {error && (
            <div
              className={`text-center py-2 px-3 rounded-lg font-semibold ${
                error.includes("Successfully") ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {error}
            </div>
          )}
  
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          <button
            onClick={Submit}
            className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg transition shadow-lg"
          >
            Login
          </button>
          <div className="text-center mt-4 text-white/70 text-sm">
          <p>
            Forgot password?{" "}
            <span
              onClick={() => window.location.href = "/forgot-password"}
              className="underline cursor-pointer hover:text-white transition-colors duration-200"
            >
              Here
            </span>.
          </p>
          <p className="mt-1">
            Don’t have an account?{" "}
            <span onClick={() => window.location.href = "/register"} className="underline cursor-pointer hover:text-white transition-colors duration-200">Register</span>
          </p>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
  
}
