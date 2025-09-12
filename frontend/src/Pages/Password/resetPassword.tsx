import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!newPassword) return alert("Enter a new password");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/password/reset-password/${token}`,
        { newPassword }
      );
      setSuccess(res.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      setSuccess("");
    }
  };

  return (
    <>
      <div className="absolute -top-24 -left-24 w-44 h-44 bg-[#6B46C1] rounded-full opacity-20 rotate-45 animate-pulse-slow"></div>
      <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-[#7C3AED] rounded-full opacity-15 rotate-12 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#6B46C1]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] font-inter">
        <div className="flex flex-col gap-4 bg-[#1A1A1A] p-8 rounded-2xl shadow-xl border border-gray-800/50 backdrop-blur-lg">
          <h2 className="text-2xl text-gray-100 font-bold text-center tracking-tight">
            Reset Password
          </h2>
  
          {success && <p className="text-green-400 text-center font-semibold">{success}</p>}
          {error && <p className="text-red-400 text-center font-semibold">{error}</p>}
  
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
          />
  
          <button
            onClick={handleReset}
            className="bg-[#6B46C1] hover:bg-[#7C3AED] text-white py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-[#6B46C1]/50"
          >
            Reset Password
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
