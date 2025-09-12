import { useEffect, useState } from "react";
import Footer from "./Components/Footer";
import axios from "axios";
import { FaBookmark, FaComment, FaEye, FaHeart, FaPaintBrush } from "react-icons/fa";
import Header from "./Components/Header";
import { GrClose } from "react-icons/gr";
import { BiBookmark } from "react-icons/bi";

export default function App() {
  const [arts, setArts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const limit = 7;
  const [hasMore, setHasMore] = useState(true);
  const [notLoggedin, setNotLoggedIn] = useState(false)
  const [_, setCurrentUser] = useState<any>(null)
  const [saveds, setSaveds] = useState<string[]>([])

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
  async function fetchSaveds() {
    try {
      const res = await axios.get("http://localhost:5000/api/save/my-saveds", {
        withCredentials: true,
      });
      setSaveds(res.data.savedArts.map((s: any) => s.art._id));
    } catch (error) {
      console.error(error);
    }
  }
  fetchSaveds();
}, []);

const saveArt = async (id: string) => {
  try {
    await axios.post(
      "http://localhost:5000/api/save/save",
      { artId: id },
      { withCredentials: true }
    );
    setSaveds(prev => [...prev, id]);
  } catch (error) {
    console.error(error);
  }
};

const unsaveArt = async (id: string) => {
  try {
    const res = await axios.delete(`http://localhost:5000/api/save/unsave/${id}`, {
      withCredentials: true
    });
    console.log(res.data);
    setSaveds(prev => prev.filter(savedId => savedId !== id));
  } catch (error: any) {
    console.error(error.response?.data || error.message);
  }
};



  
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
      <div className="bg-gray-900 min-h-screen text-white flex flex-col">
        {notLoggedin && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
            <div className="relative bg-gray-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-5 text-center max-w-sm w-full mx-4">
              <button
                onClick={() => {
                  loggedToggle();
                  localStorage.setItem("loginToggle", "true");
                }}
                title="Close"
                className="absolute top-4 right-4 text-white bg-purple-600 hover:bg-purple-700 p-2 rounded-full transition"
              >
                <GrClose size={20} />
              </button>
    
              <img
                src="https://imgs.search.brave.com/FJM3qocXPCIFEx-ThnUHVwCnlVBM1mT-ttZvSTXr-2M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni8xMDAyNC8xMDAy/NDIyNS5wbmc_c2Vt/dD1haXNfd2hpdGVf/bGFiZWw"
                alt="Login required"
                className="w-24 h-24 animate-bounce rounded-full border-4 border-purple-500"
              />
    
              <h2 className="text-2xl font-bold text-purple-400 font-inter">
                Oops! You are not logged in.
              </h2>
    
              <p className="text-gray-300">
                You need to log in to like or comment on arts.
              </p>
    
              <a
                href="/login"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 font-inter rounded-2xl text-white font-semibold hover:scale-105 transition-transform duration-300"
              >
                Log In
              </a>
            </div>
          </div>
        )}
    
        <Header />
    
        <main className="flex-1 p-6 md:p-10">
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            <button
              onClick={() => (window.location.href = "/create-arts")}
              className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <FaPaintBrush className="w-5 h-5 animate-bounce text-white" />
              <span className="text-white font-semibold">Share Your Art</span>
            </button>
    
            <button className="px-5 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white font-semibold shadow hover:bg-gray-700 transition">
              Saveds
            </button>
          </div>
    
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {arts.map(item => (
              <div
                key={item._id}
                onClick={() => window.location.href = `/art/${item._id}`}
                className="relative bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-purple-600/50 transition-all duration-500 cursor-pointer flex flex-col"
              >
                <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
                  <img
                    className="h-8 w-8 rounded-full border-2 border-purple-500"
                    // onClick={() => window.location.href = `/art/${item._id}`}
                    src={item?.user?.avatarUrl ? `http://localhost:5000${item.user.avatarUrl}` : "https://cdn-icons-png.flaticon.com/512/1250/1250743.png"}
                    alt={item?.user?.username || "Deleted User"}
                  />
                </div>
    
                <img
                  src={`http://localhost:5000${item?.imageUrl}`}
                  alt={item?.title}
                  className="w-full h-72 object-cover transition-transform duration-500 hover:scale-105"
                />
    
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all duration-300 flex flex-col justify-end p-4">
                  <h2 className="text-lg font-bold text-purple-400 group-hover:text-purple-300 truncate">
                    {item?.title}
                  </h2>
    
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((tag: string, idx: number) => (
                        <span key={idx} className="text-xs bg-purple-600 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
    
                  <div className="flex gap-4 mt-3 text-gray-300">
                    <button aria-label="Like" className="flex items-center gap-1 hover:text-red-500 transition">
                      <FaHeart className="w-4 h-4" /> {item.likes || 0}
                    </button>
                    <button aria-label="Comment" className="flex items-center gap-1 hover:text-blue-400 transition">
                      <FaComment className="w-4 h-4" /> {item.comments?.length || 0}
                    </button>
                    <button aria-label="Views" className="flex items-center gap-1 hover:text-green-400 transition">
                      <FaEye className="w-4 h-4" /> {item.view}
                    </button>
                    {saveds.includes(item._id) ? (
                    <button aria-label="Unsave" onClick={(e) => { e.stopPropagation(); unsaveArt(item._id); }} className="px-2 py-2 text-yellow-400"><FaBookmark className="w-4 h-4" /> </button>
                  ) : (
                    <button aria-label="Save" onClick={(e) => { e.stopPropagation(); saveArt(item._id); }} className="px-2 py-2 hover:text-green-400"><BiBookmark className="w-4 h-4" /></button>
                  )}

                  </div>
                </div>
              </div>
            ))}
          </div>
    
          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={fetchArts}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
              >
                🚀 Show More
              </button>
            </div>
          )}
        </main>
    
        <Footer />
      </div>
    );
    
}