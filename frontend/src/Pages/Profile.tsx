import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaComment, FaUser, FaEnvelope } from "react-icons/fa";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { BsEye } from "react-icons/bs";
import { BiPlus } from "react-icons/bi";

interface Art {
  _id: string;
  title: string;
  view: string;
  imageUrl: string;
  tags: string[];
  likes: number;
  comments: any[];
}

interface UserProfile {
  username: string;
  email: string;
  bio?: string;
  totalArts: string;
  avatarUrl?: string;
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userArts, setUserArts] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false)

  function showprof() {
    setShowProfile(!showProfile)
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return setError("Username not provided.");
      try {
        const res = await axios.get(`http://localhost:5000/api/user/user/${username}`, {
          withCredentials: true,
        });
        setUser(res.data.user || null);
        setUserArts(Array.isArray(res.data.arts) ? res.data.arts : []);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading)
    return (
      <p className="text-white text-2xl font-bold min-h-screen flex items-center justify-center animate-pulse">
        Loading...
      </p>
    );

  if (error)
    return (
      <p className="text-red-500 text-xl font-semibold min-h-screen flex items-center justify-center">
        {error}
      </p>
    );

  if (!user)
    return (
      <p className="text-gray-400 text-xl min-h-screen flex items-center justify-center">
        User not found
      </p>
    );

  return (
    <>
    <Header />
    <div className="bg-gray-900 min-h-screen text-white p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 bg-gray-800 p-6 rounded-2xl shadow-lg">
        <img
          src={user.avatarUrl || "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small_2x/user-icon-on-transparent-background-free-png.png"}
          alt={user.username}
          onClick={showprof}
          className="w-32 h-32 rounded-full object-cover border-4 border-purple-400"
        />
        <div className="flex-1 flex flex-col gap-2">
          <h1 className="text-3xl text-center font-bold text-purple-400">{user.username}</h1>
          {user.bio && <p className="text-gray-300 text-center">{user.bio}</p>}
          <div className="flex gap-4 mt-2 text-gray-400 flex-wrap">
            <div className="flex gap-1 font-inter">
                <BiPlus size={20} /> Total Arts: {user.totalArts}
            </div>
            <div className="flex items-center gap-1">
              {/* <FaEnvelope /> <span>{user.email}</span> */}
              <FaEnvelope /> <span>*******@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-6">Artworks</h2>
      {userArts.length === 0 ? (
        <p className="text-gray-400 text-center mt-8">No artworks uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userArts.map((item) => (
            <div
              key={item._id}
              className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 bg-gray-800"
            >
              <img
                src={`http://localhost:5000${item.imageUrl}`}
                alt={item.title}
                className="w-full h-64 md:h-72 lg:h-80 object-cover"
              />
              <div className="p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent absolute bottom-0 w-full">
                <h3 className="text-lg md:text-xl font-bold text-purple-400">{item.title}</h3>
                {item.tags.length > 0 && (
                  <p className="text-sm md:text-base text-gray-300 mt-1">
                    Tags: {item.tags.join(", ")}
                  </p>
                )}
                <div className="flex gap-4 mt-2 text-gray-400">
                  <div className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition">
                    <FaHeart /> <span>{item.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition">
                    <FaComment /> <span>{item.comments?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition">
                    <BsEye /> <span>{item.view}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    {showProfile && (
        <div
          onClick={showprof}  
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <img
            src={user.avatarUrl || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}


    <Footer />
    </>
  );
}