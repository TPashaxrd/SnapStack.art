import { useEffect, useState } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import axios from "axios";

interface MeData {
  username: string;
  email: string;
  IP_Address: string;
}

export default function App() {
  const [userData, setUserData] = useState<MeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get<{ user: MeData }>("http://localhost:5000/api/user/me", { withCredentials: true });
        setUserData(res.data.user);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 px-4">
        {loading ? (
          <p className="text-white text-2xl font-bold animate-pulse">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-xl font-semibold">{error}</p>
        ) : userData ? (
          // ✅ Kullanıcı giriş yaptıysa gösterilecek kart
          <div className="bg-black/70 backdrop-blur-md rounded-3xl p-8 max-w-md w-full flex flex-col gap-6 shadow-2xl border border-white/20">
            <h1 className="text-4xl font-extrabold text-white text-center">
              Welcome back, {userData.username}!
            </h1>
            <div className="flex flex-col gap-3 text-center">
              <p className="text-white/80">Email: {userData.email}</p>
              <p className="text-white/80">Your IP: {userData.IP_Address}</p>
            </div>
            <button
              onClick={() => window.location.href = "/profile"}
              className="mt-4 w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition shadow-lg"
            >
              Go to Profile
            </button>
          </div>
        ) : (
          // ❌ Kullanıcı giriş yapmamışsa gösterilecek kart
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 max-w-md w-full flex flex-col gap-6 shadow-2xl border border-white/30">
            <h1 className="text-3xl font-bold text-white text-center">
              Welcome to SnapStack.art!
            </h1>
            <p className="text-white/80 text-center">
              You are not logged in yet. Please login or register to continue.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => window.location.href = "/login"}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition shadow-lg"
              >
                Login
              </button>
              <button
                onClick={() => window.location.href = "/register"}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition shadow-lg"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
