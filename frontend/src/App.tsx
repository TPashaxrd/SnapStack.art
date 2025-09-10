import { useEffect, useState } from "react";
import Footer from "./Components/Footer";
import axios from "axios";
import { FaComment, FaEye, FaHeart, FaPaintBrush } from "react-icons/fa";
import Header from "./Components/Header";
import { GrClose } from "react-icons/gr";

export default function ReelsFeed() {
  const [arts, setArts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const limit = 7;
  const [hasMore, setHasMore] = useState(true);
  const [notLoggedin, setNotLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", { withCredentials: true });
        setCurrentUser(res.data);
      } catch (err) {
        console.error("No User Info.", err);
        setNotLoggedIn(true)
        checkData()

      }
    }
    fetchUser();
  }, []);

  function loggedToggle() {
    setNotLoggedIn(!notLoggedin)
  }

  console.log(currentUser)

  const fetchArts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/arts/all-arts?limit=${limit}&skip=${skip}`,
        { withCredentials: true }
      );
  
      if (res.data.length < limit) setHasMore(false);
      setArts(prev => [...prev, ...res.data]);
      setSkip(prev => prev + limit);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  function checkData() {
    const storedData = localStorage.getItem("loginToggle");
    const isLoggedIn = storedData ? JSON.parse(storedData) : null;
  
    if (isLoggedIn === true) {
      setNotLoggedIn(false);
    } else if (isLoggedIn === false) {
      console.log("localStorage is False")
    }
  }

  useEffect(() => {
    checkData()
  }, [])

  useEffect(() => {
    fetchArts();
  }, []);

  if (loading) return <div className="min-h-screen items-center justify-center flex text-blue-500"><div className="lds-facebook"><div></div><div></div><div></div></div></div>;
  if (error)
    return (
      <p className="text-red-500 text-xl font-semibold min-h-screen flex items-center justify-center">
        {error}
      </p>
    );

  return (
    <>      
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      {notLoggedin && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-md">
        <div className="relative bg-black/70 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-5 text-center max-w-sm w-full mx-4">
        
        <button
          onClick={() => {
            loggedToggle()
            localStorage.setItem("loginToggle", "true")
          }}
          title="Close"
          className="absolute top-4 right-4 text-white bg-purple-500 hover:bg-purple-600 p-2 rounded-full transition"
        >
          <GrClose size={20} />
        </button>

        <img
          src="https://imgs.search.brave.com/FJM3qocXPCIFEx-ThnUHVwCnlVBM1mT-ttZvSTXr-2M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni8xMDAyNC8xMDAy/NDIyNS5wbmc_c2Vt/dD1haXNfd2hpdGVf/bGFiZWw"
          alt="Login required"
          className="w-20 h-20 animate-bounce"
        />

        <h2 className="text-2xl font-bold text-purple-400 font-inter">
          Oops! You are not logged in.
        </h2>

        <p className="text-gray-300">
          To like or comment, you need to log in first.
        </p>

        <a
          href="/login"
          className="px-6 py-2 bg-purple-500 font-inter hover:bg-purple-600 rounded-2xl text-white font-semibold transition"
        >
          Log In
        </a>
      </div>
    </div>
  )}


      <Header />
      <main className="flex-1 p-4 md:p-8">
      
      <div
        onClick={() => window.location.href = "/create-arts"}
        className="flex items-center justify-center gap-3 px-6 py-3 mx-auto w-max bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer"
      >
        <FaPaintBrush className="w-5 h-5 text-white animate-bounce" />
        <span className="text-white font-semibold text-lg font-roboto-condensed">
          Share Your Art
        </span>
      </div>

        <div className="grid mt-4  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {arts.map((item) => (
          <div
            key={item._id}
            onClick={() => window.location.href = `/art/${item._id}`}
            className="group relative rounded-2xl overflow-hidden cursor-pointe bg-gradient-to-b from-gray-900 via-gray-800 to-black shadow-lg hover:shadow-purple-600/30 transition-all duration-500"
          >
            <div className="flex items-center gap-1 p-2 absolute top-2 bg-black/60 backdrop-blur-md rounded-full z-10">
              <img
                className="h-8 rounded-full bg-white px-1 py-1"
                src={`http://localhost:5000${item?.user?.avatarUrl}` || "https://cdn-icons-png.flaticon.com/512/1250/1250743.png"}
                alt="Avatar"
              />
              <span className="font-inter text-md text-white">{item?.user?.username || "Deleted User"}</span>
            </div>

            <img
              src={`http://localhost:5000${item?.imageUrl}`}
              alt={item?.title}
              className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
            />

            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black via-black/70 to-transparent">
              <h2 className="text-lg font-bold text-purple-400 group-hover:text-purple-300 transition">
                {item?.title}
              </h2>

              {item.tags.length > 0 && (
                <p className="text-xs text-gray-300 mt-1">
                  #{item.tags.join(" #")}
                </p>
              )}

              <div className="flex gap-6 mt-3">
                <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition">
                  <FaHeart className="w-4 h-4" /> <span>{item.likes || 0}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition">
                  <FaComment className="w-4 h-4" /> <span>{item.comments?.length || 0}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-400 hover:text-blue-400 transition">
                  <FaEye size={20} /> <span>{item.view}</span> 
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      </main>
      {hasMore && (
      <div className="flex justify-center mt-8">
        <button
          onClick={fetchArts}
          className="font-inter px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
        >
          🚀 Show More
        </button>
      </div>
    )}
      <Footer />
    </div>
    </>
  );
}