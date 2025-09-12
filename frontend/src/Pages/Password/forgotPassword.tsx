import axios from "axios";
import { useState } from "react"

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
         <div className="items-center justify-center h-screen flex flex-col">
            <div className="flex flex-col gap-2">
                {success}
                <input value={email} className="px-2 py-2 rounded-xl font-inter" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
                <button className="px-2 py-2 rounded bg-black text-white hover:bg-black/709" onClick={forgotPassword}>Submit</button>
            </div>
         </div>
        </>
    )
}