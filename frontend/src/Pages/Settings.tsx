import { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import axios from "axios";
import { CiSettings } from "react-icons/ci";
import { BiKey, BiPencil } from "react-icons/bi";

export default function Settings() {
  const [userData, setUserData] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/settings/update-avatar",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setSuccessMessage("✅ Avatar updated successfully!");
      setUserData({ ...userData, avatarUrl: res.data.avatarUrl });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", { withCredentials: true });
        setUserData(res.data.user);
      } catch (error: any) {
        console.error(`Error: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
      setBio(userData.bio || "");
    }
  }, [userData]);

  const updateUsername = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/settings/username",
        { username },
        { withCredentials: true }
      );
      alert(res.data.message);
      setUserData({ ...userData, username });
    } catch (err: any) {
      alert(err.response?.data?.message || "Error updating username");
    }
  };

  const updateBio = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/settings/bio",
        { bio },
        { withCredentials: true }
      );
      setSuccessMessage(`✅ ${res.data.message}`);
      setUserData({ ...userData, bio });
    } catch (err: any) {
      alert(err.response?.data?.message || "Error updating bio");
    }
  };

  const updatePassword = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/settings/password",
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      alert(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error updating password.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-500">
        <div className="lds-facebook">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-950 font-inter text-white flex flex-col items-center py-12 px-4">
        {userData && (
          <div className="w-full max-w-2xl">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border border-white/10">
              <h1 className="flex justify-center items-center gap-2 text-3xl font-bold text-purple-400">
                <CiSettings /> Settings{" "}
                <span className="text-gray-300">| {userData.username}</span>
              </h1>

              <div className="flex flex-col items-center gap-4">
                <img
                  src={
                    userData.avatarUrl
                      ? `http://localhost:5000${userData.avatarUrl}`
                      : "https://cdn-icons-png.flaticon.com/512/1250/1250743.png"
                  }
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover border-4 border-purple-500 shadow-lg"
                />
                <input
                  title="File Upload"
                  accept=".jpg,.jpeg,.png"
                  type="file"
                  onChange={handleFileChange}
                  className="text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition"
                />
                <button
                  onClick={handleUpload}
                  className="px-6 py-2 bg-purple-500 rounded-full hover:bg-purple-600 font-semibold transition"
                >
                  Upload Avatar
                </button>
              </div>

              <div className="border-b border-gray-700"></div>
              <span onClick={() => window.location.href = `/profile/${userData.username}`}>Look at your profile?</span>

              <div className="flex flex-col gap-3">
                <label className="text-gray-300 font-medium flex gap-1">
                  <BiPencil className="mt-1" /> New Username
                </label>
                <input
                  type="text"
                  placeholder="Enter new username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
                <button
                  onClick={updateUsername}
                  className="mt-2 w-full py-2 bg-purple-500 rounded-xl hover:bg-purple-600 font-semibold transition"
                >
                  Update Username
                </button>
              </div>

              <div className="border-b border-gray-700"></div>

              <div className="flex flex-col gap-3">
                <input
                  placeholder="Enter your bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
                <button
                  onClick={updateBio}
                  className="mt-2 w-full py-2 bg-purple-500 rounded-xl hover:bg-purple-600 font-semibold transition"
                >
                  Update Bio
                </button>
              </div>

              <div className="border-b border-gray-700"></div>

              <div className="flex flex-col gap-3">
                <label className="text-gray-300 font-medium flex gap-1">
                  <BiKey size={18} className="mt-1" /> Old Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter old password"
                  className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
                <label className="text-gray-300 font-medium flex gap-1">
                  <BiKey size={18} className="mt-1" /> New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
                <button
                  onClick={updatePassword}
                  className="mt-2 w-full py-2 bg-purple-500 rounded-xl hover:bg-purple-600 font-semibold transition"
                >
                  Update Password
                </button>
              </div>

              {successMessage && (
                <p className="text-green-400 text-center mt-2">{successMessage}</p>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
