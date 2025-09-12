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
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4">
        <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl p-8 w-full max-w-lg flex flex-col gap-4">
            <h3 className="text-4xl font-bold text-white text-center border-b border-white/30 pb-2 mb-4">
            Contact Us
            </h3>
    
            {success && <span className="text-green-400 font-semibold animate-pulse">{success}</span>}
            {error && <span className="text-red-400 font-semibold animate-pulse">{error}</span>}
    
            <input
                type="text"
                placeholder="Your Subject"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-white/70 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 font-inter"
            />
            <textarea
                placeholder="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-white/70 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 font-inter resize-none h-32"
            />
            <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-white/70 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 font-inter"
            />
    
            <button
                onClick={Submit}
                className="mt-2 px-6 py-3 rounded-2xl bg-black text-white font-bold hover:bg-black/70 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
            Submit
            </button>
        </div>
        </div>
        <Footer />
    </>
    )      
}