import { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import axios from "axios";

export default function Contact() {
    const [IP_Address, setIP_Address] = useState("")
    const [message, setMessage] = useState("")
    const [email, setEmail] = useState("")
    const [title, setTitle] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        async function checkIP() {
            try {
                const res = await axios.get("https://api.ipify.org?format=json")
                setIP_Address(res.data.ip)   
            } catch (error) {
                alert("We have error." + error)
            } finally {
                setLoading(false)
            }
        }
        checkIP()
    }, [])

    async function Submit() {
        if (!title || !message || !email) {
            setError("All fields are required.")
            return
        }
        try {
            const res = await axios.post("http://localhost:5000/api/contact/create", {
                title,
                message,
                email,
                IP_Address
            })
    
            if (res.status === 201) {
                setTitle("")
                setMessage("")
                setEmail("")
                setError("")
                setSuccess("Successfully submitted your contact!")
            }
        } catch (error: any) {
            if (error.response) {
                setError(error.response.data.message || "Server error")
            } else {
                setError(error.message || "Unknown error")
            }
        }
    }
    

    if (loading) return <div className="min-h-screen items-center justify-center flex text-blue-500"><div className="lds-facebook"><div></div><div></div><div></div></div></div>;

    return (
        <>
          <div className="absolute -top-24 -left-24 w-44 h-44 bg-[#6B46C1] rounded-full opacity-20 rotate-45 animate-pulse-slow"></div>
          <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-[#7C3AED] rounded-full opacity-15 rotate-12 animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#6B46C1]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
          <Header />
          <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] p-4 font-inter">
            <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl shadow-xl border border-gray-800/50 p-8 w-full max-w-lg flex flex-col gap-4">
              <h3 className="text-4xl font-bold text-gray-100 text-center border-b border-gray-800/50 pb-2 mb-4 tracking-tight">
                Contact Us
              </h3>
      
              {success && <span className="text-green-400 font-semibold animate-pulse text-center">{success}</span>}
              {error && <span className="text-red-400 font-semibold animate-pulse text-center">{error}</span>}
      
              <input
                type="text"
                placeholder="Your Subject"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-4 py-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300 font-inter"
              />
              <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="px-4 py-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300 font-inter resize-none h-32"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300 font-inter"
              />
      
              <button
                onClick={Submit}
                className="mt-2 px-6 py-3 rounded-lg bg-[#6B46C1] text-white font-bold hover:bg-[#7C3AED] transition-all duration-300 shadow-lg hover:shadow-[#6B46C1]/50"
              >
                Submit
              </button>
            </div>
          </div>
          <Footer />
        </>
    );  
}