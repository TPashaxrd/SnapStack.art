import { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import axios from "axios";

interface UserData {
  username: string;
  email: string;
  password: string;
  IP_Address: string;
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [IP_Address, setIP_Address] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => setIP_Address(response.data.ip))
      .catch((err) => console.error("Error fetching IP:", err));
  }, []);

  const Submit = async () => {
    if (!username || !email || !password || !IP_Address) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axios.post<UserData>("http://localhost:5000/api/user/register", {
        username,
        email,
        password,
        IP_Address,
      });

      console.log("User registered:", res.data);
      setUsername("");
      setEmail("");
      setPassword("");
      setError("Successfully Registered! Redirecting...");
      setTimeout(() => (window.location.href = "/login"), 800);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
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
      <div className="flex flex-col items-center justify-center mt-16 px-4 min-h-[calc(100vh-200px)]">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full flex flex-col gap-6">
          <h1 className="text-3xl font-extrabold text-white text-center">Register to SnapStack</h1>

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
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <p className="text-white/70 text-center mt-2">
            Already have account? <span onClick={() => window.location.href = "/login" } className="underline cursor-pointer hover:text-white">Login</span>
          </p>
          <button
            onClick={Submit}
            className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg transition shadow-lg"
          >
            Submit
          </button>

          <span className="text-white/70 text-center mt-2">Your IP Address: {IP_Address}</span>
        </div>
      </div>
      <Footer />
    </>
  );
}
