import axios from "axios";
import { useEffect, useState } from "react";
import { BiHome, BiPhone, BiSearch, BiUpload, BiUser } from "react-icons/bi";
import { FaSignOutAlt, FaUpload } from "react-icons/fa";

interface MeData {
  username: string;
  email: string;
  IP_Address: string;
}

export default function Header() {
  const [userData, setUserData] = useState<MeData | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function logout() {
    axios.get("http://localhost:5000/api/user/logout")
    setTimeout(() => window.location.href = "/", 200)
  }

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get<{ user: MeData }>("http://localhost:5000/api/user/me", {
          withCredentials: true,
        });
        setUserData(res.data.user);
      } catch (error: any) {
        console.info("No login");
      }
    };
    fetchMe();
  }, []);

  return (
    <header className="bg-[#0F0F0F] text-gray-100 font-inter py-4 shadow-xl border-b border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div
          onClick={() => (window.location.href = "/")}
          className="text-3xl font-extrabold tracking-tight cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-[#6B46C1] to-[#7C3AED] hover:scale-105 transition-all duration-300"
        >
          SnapStack.art
        </div>

        {userData && (
          <span className="hidden lg:block text-lg font-semibold text-gray-100 hover:text-[#6B46C1] transition-all duration-300">
            {userData.username}
          </span>
        )}

        <nav className="hidden md:flex items-center space-x-4">
          <a
            href="/"
            className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2"
          >
            <BiHome size={24} />
            <span className="text-sm font-semibold">Home</span>
          </a>
          {userData ? (
            <>
              <a
                href={`/profile/${userData.username}`}
                className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2"
              >
                <BiUser size={24} />
                <span className="text-sm font-semibold">Profile</span>
              </a>
              <a
                href="/settings"
                className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2"
              >
                <BiUser size={24} />
                <span className="text-sm font-semibold">Settings</span>
              </a>
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-red-500 hover:bg-red-600 hover:shadow-red-500/50 transition-all duration-300 flex items-center gap-2"
              >
                <FaSignOutAlt size={24} />
                <span className="text-sm font-semibold">Logout</span>
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2"
            >
              <BiUser size={24} />
              <span className="text-sm font-semibold">Login</span>
            </a>
          )}
          <a
            href="/search"
            className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2"
          >
            <BiSearch size={24} />
            <span className="text-sm font-semibold">Search</span>
          </a>
          <a
            href="/create"
            className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2">
              <FaUpload size={23} /> Upload
          </a>
        </nav>

        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-100 hover:text-[#6B46C1] focus:outline-none transition-all duration-300 text-2xl"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden bg-[#1A1A1A] shadow-xl mt-2 mx-4 py-4 rounded-lg border border-gray-800/50 animate-slide-down">
          <div className="flex flex-col space-y-3 px-4">
            <a
              href="/"
              className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2 text-gray-100"
            >
              <BiHome size={24} />
              <span className="text-sm font-semibold">Home</span>
            </a>
            {userData ? (
              <>
                <a
                  href={`/profile/${userData.username}`}
                  className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2 text-gray-100"
                >
                  <BiUser size={24} />
                  <span className="text-sm font-semibold">Profile</span>
                </a>
                <a
                  href="/settings"
                  className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2 text-gray-100"
                >
                  <BiUser size={24} />
                  <span className="text-sm font-semibold">Settings</span>
                </a>
                <a
                  href="/create"
                  className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2 text-gray-100"
                >
                  <BiUpload size={24} />
                  <span className="text-sm font-semibold">Create</span>
                </a>
                
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-red-500 hover:bg-red-600 hover:shadow-red-500/50 transition-all duration-300 flex items-center gap-2 text-white"
                >
                  <FaSignOutAlt size={24} />
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2 text-gray-100"
              >
                <BiUser size={24} />
                <span className="text-sm font-semibold">Login</span>
              </a>
            )}
            <a
              href="/search"
              className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2 text-gray-100"
            >
              <BiSearch size={24} />
              <span className="text-sm font-semibold">Search</span>
            </a>
            <a
              href="/contact"
              className="p-2 rounded-lg hover:bg-[#2D2D2D] hover:text-[#6B46C1] transition-all duration-300 flex items-center gap-2 text-gray-100"
            >
              <BiPhone size={24} />
              <span className="text-sm font-semibold">Contact & Help</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}