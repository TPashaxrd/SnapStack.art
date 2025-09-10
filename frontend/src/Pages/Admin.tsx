import { useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import axios from "axios";
import { BiUser, BiImage } from "react-icons/bi";

export default function Admin() {
  const [stats, setStats] = useState({
    UserCount: 0,
    ArtCount: 0,
    CommentsCount: 0,
    SubsCount: 0
  });
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const handlePasswordCheck = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/dashboard/totals",
        { password },
        { withCredentials: true }
      );

      if (res.data.success) {
        setStats(res.data.dashboard);
        setIsAdmin(true);
        setAuthMessage("✅ Password correct");
      } else {
        setIsAdmin(false);
        setAuthMessage("❌ Wrong password");
      }
    } catch (err) {
      setIsAdmin(false);
      setAuthMessage("❌ Something went wrong");
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-950 text-white font-inter p-10">
        <h1 className="text-5xl font-bold text-purple-400 mb-12 text-center">
          Admin Dashboard
        </h1>

        {!isAdmin ? (
          <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-lg flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <button
              onClick={handlePasswordCheck}
              className="w-full py-2 bg-purple-500 rounded-xl hover:bg-purple-600 font-semibold transition"
            >
              Verify
            </button>
            {authMessage && (
              <p className={`mt-2 font-semibold ${isAdmin ? "text-green-400" : "text-red-500"}`}>
                {authMessage}
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/60 rounded-3xl shadow-lg p-6 flex flex-col items-center gap-2">
              <BiUser size={36} className="text-purple-400" />
              <h2 className="text-3xl font-bold">{stats.UserCount}</h2>
              <p>Total Users</p>
            </div>
            <div className="bg-gray-800/60 rounded-3xl shadow-lg p-6 flex flex-col items-center gap-2">
              <BiImage size={36} className="text-purple-400" />
              <h2 className="text-3xl font-bold">{stats.ArtCount}</h2>
              <p>Total Arts</p>
            </div>
            <div className="bg-gray-800/60 rounded-3xl shadow-lg p-6 flex flex-col items-center gap-2">
              <BiImage size={36} className="text-purple-400" />
              <h2 className="text-3xl font-bold">{stats.CommentsCount}</h2>
              <p>Total Comments</p>
            </div>
            <div className="bg-gray-800/60 rounded-3xl shadow-lg p-6 flex flex-col items-center gap-2">
              <BiUser size={36} className="text-purple-400" />
              <h2 className="text-3xl font-bold">{stats.SubsCount}</h2>
              <p>Total Subscribers</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
