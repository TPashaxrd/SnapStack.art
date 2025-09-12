import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaComment,
  FaEnvelope,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { BsEye } from "react-icons/bs";
import { BiPlus } from "react-icons/bi";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

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
  socials?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };
  publicEmail: string;
}

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userArts, setUserArts] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAvatar, setShowAvatar] = useState(false);

  const toggleAvatar = () => setShowAvatar(!showAvatar);

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
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#6B46C1] rounded-full opacity-20 rotate-12 animate-pulse-slow blur-2xl"></div>
        <div className="absolute -bottom-28 -right-24 w-80 h-80 bg-[#7C3AED] rounded-full opacity-15 rotate-45 animate-pulse-slow blur-2xl"></div>
        <Header />
        <div className="bg-[#0F0F0F] min-h-screen text-gray-100 font-inter p-4 md:p-8 relative">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 bg-[#1A1A1A] backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-800/50 transition-all hover:shadow-[#6B46C1]/50 relative">
            <img
              src={
                user.avatarUrl
                  ? `http://localhost:5000${user.avatarUrl}`
                  : "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small_2x/user-icon-on-transparent-background-free-png.png"
              }
              alt={user.username}
              onClick={toggleAvatar}
              className="w-32 h-32 rounded-full object-cover border-4 border-[#6B46C1] cursor-pointer hover:scale-110 transition-transform duration-300 shadow-lg"
            />
    
            <div className="flex-1 flex flex-col gap-3 text-center md:text-left">
              <h1 className="text-3xl font-bold text-[#6B46C1] tracking-tight">{user.username}</h1>
              {user.bio && <p className="text-gray-300 italic">{user.bio}</p>}
    
              <div className="flex gap-4 mt-2 justify-center md:justify-start flex-wrap">
                {user.socials?.instagram && (
                  <a
                    href={`https://instagram.com/${user.socials.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-semibold hover:scale-105 transition-all duration-300"
                  >
                    <FaInstagram /> {user.socials.instagram}
                  </a>
                )}
                {user.socials?.twitter && (
                  <a
                    href={`https://twitter.com/${user.socials.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-semibold hover:scale-105 transition-all duration-300"
                  >
                    <FaTwitter /> {user.socials.twitter}
                  </a>
                )}
                {user.socials?.tiktok && (
                  <a
                    href={`https://tiktok.com/@${user.socials.tiktok}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-semibold hover:scale-105 transition-all duration-300"
                  >
                    <FaTiktok /> {user.socials.tiktok || "—"}
                  </a>
                )}
                {user.socials?.youtube && (
                  <a
                    href={`https://youtube.com/@${user.socials.youtube}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-semibold hover:scale-105 transition-all duration-300"
                  >
                    <FaYoutube /> {user.socials.youtube || "—"}
                  </a>
                )}
              </div>
    
              <div className="flex gap-6 mt-3 justify-center md:justify-start flex-wrap text-gray-400">
                <div className="flex items-center gap-1 hover:text-[#6B46C1] transition-all duration-300">
                  <BiPlus size={18} /> Total Arts: {user.totalArts}
                </div>
                <div className="flex cursor-pointer items-center gap-1 hover:text-[#6B46C1] transition-all duration-300">
                  {user.publicEmail ? (
                    <div
                      onClick={() => (window.location.href = `mailto:${user?.publicEmail}`)}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#6B46C1] hover:bg-[#7C3AED] shadow-lg text-white font-inter"
                    >
                      <FaEnvelope className="text-white text-lg" />
                      <span>{user.publicEmail}</span>
                    </div>
                  ) : (
                    <>
                      <FaEnvelope /> <span>x*******@snapstack.art</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
    
          <h2 className="text-2xl md:text-3xl font-bold text-[#6B46C1] mb-6 text-center md:text-left tracking-tight">
            Artworks
          </h2>
          {userArts.length === 0 ? (
            <p className="text-gray-400 text-center mt-8">No artworks uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userArts.map((item) => (
                <div
                  key={item._id}
                  className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-800/50 hover:shadow-[#6B46C1]/50 transition-all duration-300 bg-[#1A1A1A] backdrop-blur-sm cursor-pointer group"
                  onClick={() => (window.location.href = `/art/${item._id}`)}
                >
                  <img
                    src={`http://localhost:5000${item.imageUrl}`}
                    alt={item.title}
                    className="w-full h-64 md:h-72 lg:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="p-4 bg-[#1A1A1A]/80 absolute bottom-0 w-full group-hover:bg-[#2D2D2D]/80 transition-all duration-500">
                    <h3 className="text-lg md:text-xl font-bold text-[#6B46C1]">{item.title}</h3>
                    {item.tags.length > 0 && (
                      <p className="text-sm md:text-base text-gray-300 mt-1">
                        Tags: {item.tags.join(", ")}
                      </p>
                    )}
                    <div className="flex gap-4 mt-2 text-gray-400">
                      <div className="flex items-center gap-1 hover:text-red-400 transition-all duration-300">
                        <FaHeart /> <span>{item.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-[#6B46C1] transition-all duration-300">
                        <FaComment /> <span>{item.comments?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-green-400 transition-all duration-300">
                        <BsEye /> <span>{item.view}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
    
          {showAvatar && (
            <div
              onClick={toggleAvatar}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 cursor-pointer"
            >
              <img
                src={`http://localhost:5000${user.avatarUrl}` || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="max-w-[90%] max-h-[90%] rounded-2xl shadow-xl animate-scale-up"
              />
            </div>
          )}
        </div>
        <Footer />
      </>
    );
}