import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="flex flex-col gap-4 bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl text-white font-bold text-center">Reset Password</h2>

        {success && <p className="text-green-400">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white"
        />

        <button
          onClick={handleReset}
          className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
