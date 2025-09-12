import { useEffect, useState } from "react";
import Footer from "./Components/Footer";
import axios from "axios";
import { FaBookmark, FaComment, FaEye, FaHeart, FaPaintBrush } from "react-icons/fa";
import Header from "./Components/Header";
import { GrClose } from "react-icons/gr";
import { BiBookmark } from "react-icons/bi";

export default function ReelsFeed() {
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
    <>      
    <div className="bg-black min-h-screen text-white flex flex-col">
    {notLoggedin && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-md">
        <div className="relative bg-black/70 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-5 text-center max-w-sm w-full mx-4">
          <button
            onClick={() => {
              loggedToggle();
              localStorage.setItem("loginToggle", "true");
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

      <div className="flex text-sm font-semibold gap-2">
        <button
          onClick={() => (window.location.href = "/create-arts")}
          className="flex items-center justify-center gap-3 px-6 py-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-200 font-semibold shadow-md hover:bg-gray-800 hover:border-purple-500 hover:text-purple-400 transition-all duration-300 cursor-pointer"
        >
          <FaPaintBrush className="w-5 h-5 text-purple-400 animate-bounce" />
          <span className="text-gray-200 font-roboto-condensed text-lg font-semibold">
            Share Your Art
          </span>
        </button>


        <button className="px-3 rounded bg-gray-900 border border-gray-700 text-gray-200 font-semibold shadow-md hover:bg-gray-800 hover:border-purple-500 hover:text-purple-400 transition-all duration-300 font-inter">
          Saveds
        </button>
      </div>

      <div className="flex flex-wrap mt-6 gap-6 justify-center">
        {arts.map((item) => (
          <div
            key={item._id}
            // onClick={() => window.location.href = `/art/${item._id}`}
            className="relative w-full sm:w-[48%] md:w-[31%] lg:w-[23%] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-purple-600/50 transition-all duration-500 flex flex-col"
          >
            <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
              <img
                className="h-8 w-8 rounded-full border-2 border-purple-500"
                src={item?.user?.avatarUrl ? `http://localhost:5000${item.user.avatarUrl}` : "https://cdn-icons-png.flaticon.com/512/1250/1250743.png"}
                alt="Avatar"
                title={item?.user?.username || "Deleted User"}
              />
            </div>

            <img
              src={`http://localhost:5000${item?.imageUrl}`}
              alt={item?.title}
              className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 flex flex-col justify-end p-4">
              <h2 className="text-lg font-bold text-purple-400 group-hover:text-purple-300 truncate">
                {item?.title}
              </h2>

              {item.tags.length > 0 && (
                <div className="font-inter flex flex-wrap gap-1 mt-1">
                  {item.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="text-xs bg-purple-600 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-3 text-gray-300">
                <button className="flex items-center gap-1 hover:text-red-500 transition">
                  <FaHeart className="w-4 h-4" /> <span>{item.likes || 0}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-400 transition">
                  <FaComment className="w-4 h-4" /> <span>{item.comments?.length || 0}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-green-400 transition">
                  <FaEye className="w-4 h-4" /> <span>{item.view}</span>
                </button>
                {saveds.includes(item._id) ? (
                <button title="UnSave" onClick={() => unsaveArt(item._id)} className="text-yellow-400">
                  <FaBookmark className="w-4 h-4" />
                </button>
              ) : (
                <button title="Save" onClick={() => saveArt(item._id)} className="hover:text-green-400">
                  <BiBookmark className="w-4 h-4" />
                </button>
              )}
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </main>

    <Footer />
  </div>
    </>
  );
}