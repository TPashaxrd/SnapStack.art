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
      <div className="absolute -top-24 -left-24 w-44 h-44 bg-[#6B46C1] rounded-full opacity-20 rotate-45 animate-pulse-slow"></div>
      <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-[#7C3AED] rounded-full opacity-15 rotate-12 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#6B46C1]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 bg-[#0F0F0F]">
        <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl shadow-xl border border-gray-800/50 p-10 max-w-md w-full flex flex-col gap-6">
          <h1 className="text-4xl font-extrabold text-gray-100 text-center tracking-tight font-inter">
            Login to SnapStack
          </h1>
  
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
            className="w-full px-4 py-3 rounded-lg bg-[#2D2D2D] border border-gray-800/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#2D2D2D] border border-gray-800/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
          />
          <button
            onClick={Submit}
            className="w-full py-3 rounded-lg bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-[#6B46C1]/50"
          >
            Login
          </button>
          <div className="text-center mt-4 text-gray-400 text-sm">
            <p>
              Forgot password?{" "}
              <span
                onClick={() => (window.location.href = "/forgot-password")}
                className="underline cursor-pointer hover:text-[#6B46C1] transition-all duration-200"
              >
                Here
              </span>.
            </p>
            <p className="mt-1">
              Don’t have an account?{" "}
              <span
                onClick={() => (window.location.href = "/register")}
                className="underline cursor-pointer hover:text-[#6B46C1] transition-all duration-200"
              >
                Register
              </span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}