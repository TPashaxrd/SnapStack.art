import axios from "axios";
import { useEffect, useState } from "react";
import { BiHome, BiSearch, BiUser } from "react-icons/bi";

interface MeData {
    username: string;
    email: string;
    IP_Address: string;
}

export default function Header() {
  const [error, setError] = useState("")
  const [userData, setUserData] = useState<MeData | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMe = async () => {
        try {
            const res = await axios.get<{ user: MeData }>("http://localhost:5000/api/user/me", { withCredentials: true });
            setUserData(res.data.user)
        } catch (error: any) {
            setError("Failed to fetch user data.")
        } finally {
            setLoading(false)
        }
    }
    fetchMe()
  }, [])

  if(loading) return <p>31</p>

  return (
    <header className="bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 text-black py-4 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">

        <div
          onClick={() => window.location.href = "/"}
          className="text-3xl cursor-pointer hover:text-black/70 font-extrabold tracking-wide"
        >
          SnapStack.art
        </div>

        <div className="hidden md:flex space-x-4">
          <a href="#" className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <BiHome size={28} className="text-black hover:text-yellow-400 transition-colors" />
          </a>
          <a href="#" className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <BiUser size={28} className="text-black hover:text-yellow-400 transition-colors" />
          </a>
          <a href="#" className="p-2 rounded-md hover:bg-gray-100 transition-colors">
            <BiSearch size={28} className="text-black hover:text-yellow-400 transition-colors" />
          </a>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-black hover:text-yellow-400 focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden shadow-md mt-2 px-4 py-2 flex flex-col space-y-2">
          <a href="#" className="p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-2">
            <BiHome size={24} /> <span>Ana Sayfa</span>
          </a>
          <a href="#" className="p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-2">
            <BiUser size={24} /> <span>Profil</span>
          </a>
          <a href="#" className="p-2 rounded-md hover:bg-gray-100 transition-colors flex items-center space-x-2">
            <BiSearch size={24} /> <span>Ara</span>
          </a>
        </div>
      )}
    </header>
  );
}
