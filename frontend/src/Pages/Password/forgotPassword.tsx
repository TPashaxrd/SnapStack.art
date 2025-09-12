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
          <Header />
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
            <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl p-8 w-full max-w-sm flex flex-col gap-4">
              
              <h2 className="text-3xl font-bold text-white text-center mb-4 border-b border-white/30 pb-2">
                Forgot Password
              </h2>
      
              {success && <span className="text-green-400 font-semibold animate-pulse text-center">{success}</span>}
      
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-white/70 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 font-inter"
              />
      
              <button
                onClick={forgotPassword}
                className="mt-2 px-6 py-3 rounded-2xl bg-black text-white font-bold hover:bg-black/70 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Submit
              </button>
      
              <p className="text-white/70 text-center text-sm mt-2">
                Remembered your password?{" "}
                <span
                  onClick={() => (window.location.href = "/login")}
                  className="underline cursor-pointer hover:text-white transition-colors duration-200"
                >
                  Login
                </span>
              </p>
            </div>
          </div>
          <Footer />
        </>
    )
}