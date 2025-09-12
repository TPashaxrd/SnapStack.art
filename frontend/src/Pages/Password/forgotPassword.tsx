import axios from "axios";
import { useState } from "react"
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [success, setSuccess] = useState("")

    const forgotPassword = async () => {
        if(!email) {
            alert("all fields are required.")
            return;
        }
        try {
            const res = await axios.post("http://localhost:5000/api/password/forgot-password", {
                email
            })
            setSuccess(res.data.message)
        } catch (error: any) {
            console.error(error.response?.data?.message || error.message)
        }
    }


    return (
    <>
        <div className="absolute -top-24 -left-24 w-44 h-44 bg-[#6B46C1] rounded-full opacity-20 rotate-45 animate-pulse-slow"></div>
        <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-[#7C3AED] rounded-full opacity-15 rotate-12 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#6B46C1]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] p-4 font-inter">
        <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl shadow-xl border border-gray-800/50 p-8 w-full max-w-sm flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-gray-100 text-center mb-4 border-b border-gray-800/50 pb-2 tracking-tight">
            Forgot Password
            </h2>
    
            {success && (
            <span className="text-green-400 font-semibold animate-pulse text-center">
                {success}
            </span>
            )}
    
            <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300 font-inter"
            />
    
            <button
            onClick={forgotPassword}
            className="mt-2 px-6 py-3 rounded-lg bg-[#6B46C1] text-white font-bold hover:bg-[#7C3AED] transition-all duration-300 shadow-lg hover:shadow-[#6B46C1]/50"
            >
            Submit
            </button>
    
            <p className="text-gray-400 text-center text-sm mt-2">
            Remembered your password?{" "}
            <span
                onClick={() => (window.location.href = "/login")}
                className="underline cursor-pointer hover:text-[#6B46C1] transition-all duration-300"
            >
                Login
            </span>
            </p>
        </div>
        </div>
        <Footer />
    </>
);
}