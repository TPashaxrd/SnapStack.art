import { useState } from "react";
import axios from "axios";

export default function Admin() {
  const [stats, setStats] = useState({
    UserCount: 0,
    ArtCount: 0,
    CommentsCount: 0
  });
  const [password, setPassword] = useState("");
  const [authSuccess, setAuthSuccess] = useState<boolean | null>(null);

  const handlePasswordCheck = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/admin/verify-password", 
        { password }, 
        { withCredentials: true }
      );
      setAuthSuccess(res.data.success);
      if (res.data.success) fetchStats(); // şifre doğruysa verileri çek
    } catch (err) {
      setAuthSuccess(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/totals", { withCredentials: true });
      setStats(res.data.dashboard);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-purple-400 mb-6">Admin Dashboard</h1>

      <div className="mb-6">
        <input 
          type="password" 
          placeholder="Enter admin password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="p-3 rounded-lg text-black"
        />
        <button onClick={handlePasswordCheck} className="ml-2 px-4 py-2 bg-purple-500 rounded-lg">Verify</button>
        {authSuccess !== null && (
          <span className={`ml-4 ${authSuccess ? "text-green-400" : "text-red-500"}`}>
            {authSuccess ? "✅ Password correct" : "❌ Wrong password"}
          </span>
        )}
      </div>

      {authSuccess && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <h2 className="text-2xl font-bold">{stats.UserCount}</h2>
            <p>Total Users</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <h2 className="text-2xl font-bold">{stats.ArtCount}</h2>
            <p>Total Arts</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl text-center">
            <h2 className="text-2xl font-bold">{stats.CommentsCount}</h2>
            <p>Total Comments</p>
          </div>
        </div>
      )}
    </div>
  );
}
