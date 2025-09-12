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
  const [instagram, setInstagram] = useState("")
  const [twitter, setTwitter] = useState("")
  const [tiktok, setTiktok] = useState("")
  const [youtube, setYoutube] = useState("")
  const [socialAlert, setSocialAlert] = useState("")
  const [publicEmail, setPublicEmail] = useState("")
  const [publicEmailAlert, setPublicEmailAlert] = useState("")

  async function updateSocials() {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/settings/change-socials",
        { instagram, twitter, tiktok, youtube},
        { withCredentials: true}
      )
      setSuccessMessage("Socials updated successfully")
      setSocialAlert("")
      setUserData({ ...userData, socials: res.data.socials})
    } catch (error: any) {
      if(error.response && error.response.status === 400) {
        setSuccessMessage("")
        setSocialAlert(error.response.data.message)
      } else {
        setSocialAlert("Something went wrong.")
      }
    }
  }

  function Logout() {
    try {
      axios.get("http://localhost:5000/api/user/logout")
      setTimeout(() => window.location.href = "/", 200)
    } catch (error) {
      
    }
  }
  async function updatePublicEmail() {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/settings/change-public-email",
        { publicEmail },
        { withCredentials: true }
      )
      setPublicEmailAlert("Public email added successfully")
      setUserData({ ...userData, publicEmail: res.data.publicEmail})

    } catch (error: any) {
      setPublicEmailAlert(error.message)
    }
  }

  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
      setBio(userData.bio || "");
      setInstagram(userData.socials?.instagram || "");
      setTwitter(userData.socials?.twitter || "");
      setTiktok(userData.socials?.tiktok || "");
      setYoutube(userData.socials?.youtube || "");
      setPublicEmail(userData?.publicEmail || "")
    }
  }, [userData]);
  

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
        setTimeout(() => window.location.href = "/", 200)
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);



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
        <div className="min-h-screen bg-[#0F0F0F] font-inter text-gray-100 flex flex-col items-center py-12 px-4">
          {userData && (
            <div className="w-full max-w-2xl">
              <div className="bg-[#1A1A1A] backdrop-blur-lg rounded-2xl shadow-xl border border-gray-800/50 p-10 flex flex-col gap-8">
                <h1 className="flex justify-center items-center gap-2 text-3xl font-bold text-[#6B46C1] tracking-tight">
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
                    className="w-28 h-28 rounded-full object-cover border-4 border-[#6B46C1] shadow-lg"
                  />
                  <input
                    title="File Upload"
                    accept=".jpg,.jpeg,.png"
                    type="file"
                    onChange={handleFileChange}
                    className="text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#6B46C1] file:text-white hover:file:bg-[#7C3AED] transition-all duration-300"
                  />
                  <button
                    onClick={handleUpload}
                    className="px-6 py-2 bg-[#6B46C1] rounded-lg hover:bg-[#7C3AED] font-semibold transition-all duration-300 shadow-lg hover:shadow-[#6B46C1]/50"
                  >
                    Upload Avatar
                  </button>
                </div>
    
                <div className="border-b border-gray-800/50"></div>
                <span
                  onClick={() => (window.location.href = `/profile/${userData.username}`)}
                  className="text-gray-300 hover:text-[#6B46C1] cursor-pointer transition-all duration-300"
                >
                  Look at your profile?
                </span>
    
                <div className="flex flex-col gap-3">
                  <label className="text-gray-300 font-medium flex gap-1">
                    <BiPencil className="mt-1" /> New Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter new username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
                  />
                  <button
                    onClick={updateUsername}
                    className="mt-2 w-full py-2 bg-[#6B46C1] rounded-lg hover:bg-[#7C3AED] font-semibold transition-all duration-300 shadow-lg hover:shadow-[#6B46C1]/50"
                  >
                    Update Username
                  </button>
                </div>
    
                <div className="border-b border-gray-800/50"></div>
    
                <div className="flex flex-col gap-3">
                  <input
                    placeholder="Enter your bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
                  />
                  <button
                    onClick={updateBio}
                    className="mt-2 w-full py-2 bg-[#6B46C1] rounded-lg hover:bg-[#7C3AED] font-semibold transition-all duration-300 shadow-lg hover:shadow-[#6B46C1]/50"
                  >
                    Update Bio
                  </button>
                </div>
    
                <div className="border-b border-gray-800/50"></div>
    
                <div className="flex flex-col gap-3">
                  <span className={`text-center ${publicEmailAlert.includes("successfully") ? "text-green-400" : "text-red-400"}`}>
                    {publicEmailAlert}
                  </span>
                  <h2 className="text-gray-300 font-bold">Public Email</h2>
                  <input
                    placeholder="example: snapstack@snapstack.art"
                    value={publicEmail}
                    onChange={(e) => setPublicEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
                  />
                  <button
                    onClick={updatePublicEmail}
                    className="mt-2 w-full py-2 bg-[#6B46C1] rounded-lg hover:bg-[#7C3AED] font-semibold transition-all duration-300 shadow-lg hover:shadow-[#6B46C1]/50"
                  >
                    Update Public Email
                  </button>
                </div>
    
                <div className="border-b border-gray-800/50"></div>
    
                <div className="flex flex-col gap-3">
                  <span className="text-red-400 text-center">{socialAlert}</span>
                  <h2 className="text-gray-300 font-bold">Social Links</h2>
                  <input
                    placeholder="@Instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
                  />
                  <input
                    placeholder="@Twitter"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
                  />
                  <input
                    placeholder="@TikTok"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
                  />
                  <input
                    placeholder="@YouTube"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
                  />
                  <button
                    onClick={updateSocials}
                    className="mt-2 w-full py-2 bg-[#6B46C1] rounded-lg hover:bg-[#7C3AED] font-semibold transition-all duration-300 shadow-lg hover:shadow-[#6B46C1]/50"
                  >
                    Update Socials
                  </button>
                </div>
    
                <div className="border-b border-gray-800/50"></div>
    
                <div className="flex flex-col gap-3">
                  <label className="text-gray-300 font-medium flex gap-1">
                    <BiKey size={18} className="mt-1" /> Old Password
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter old password"
                    className="w-full p-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
                  />
                  <label className="text-gray-300 font-medium flex gap-1">
                    <BiKey size={18} className="mt-1" /> New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full p-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
                  />
                  <button
                    onClick={updatePassword}
                    className="mt-2 w-full py-2 bg-[#6B46C1] rounded-lg hover:bg-[#7C3AED] font-semibold transition-all duration-300 shadow-lg hover:shadow-[#6B46C1]/50"
                  >
                    Update Password
                  </button>
                </div>
    
                <div className="flex flex-col gap-3">
                  <button
                    onClick={Logout}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                  >
                    Logout
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
