import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaHeart, FaComment, FaEye } from "react-icons/fa";
import axios from "axios";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

interface User {
  _id: string;
  username: string;
  avatarUrl: string;
  bio: string;
}

interface Art {
  _id: string;
  title: string;
  imageUrl: string;
  tags?: string[];
  likes?: number;
  comments?: any[];
  view?: number;
}

interface SearchResult {
  users: User[];
  arts: Art[];
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult>({ users: [], arts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skipUsers, setSkipUsers] = useState(0);
  const [skipArts, setSkipArts] = useState(0);
  const limit = 6;
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [hasMoreArts, setHasMoreArts] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  const fetchSearch = async (reset = false) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<SearchResult>(
        `http://localhost:5000/api/search?q=${encodeURIComponent(
          query
        )}&skipUsers=${reset ? 0 : skipUsers}&skipArts=${reset ? 0 : skipArts}&limit=${limit}`
      );

      setSearchResult((prev) => ({
        users: reset ? res.data.users : [...prev.users, ...res.data.users],
        arts: reset ? res.data.arts : [...prev.arts, ...res.data.arts],
      }));

      setSkipUsers((prev) => (reset ? res.data.users.length : prev + res.data.users.length));
      setSkipArts((prev) => (reset ? res.data.arts.length : prev + res.data.arts.length));

      if (res.data.users.length < limit) setHasMoreUsers(false);
      if (res.data.arts.length < limit) setHasMoreArts(false);
    } catch (err) {
      console.error(err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      fetchSearch(true);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const handleScroll = useCallback(() => {
    if (loading) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      if (hasMoreUsers || hasMoreArts) fetchSearch();
    }
  }, [loading, hasMoreUsers, hasMoreArts, query]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#6B46C1] rounded-full opacity-20 rotate-12 animate-pulse-slow blur-2xl"></div>
      <div className="absolute -bottom-28 -right-24 w-80 h-80 bg-[#7C3AED] rounded-full opacity-15 rotate-45 animate-pulse-slow blur-2xl"></div>
      <Header />
      <div className="bg-gradient-to-b from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] min-h-screen text-gray-100 font-inter p-2 sm:p-4 relative">
        <h1 className="text-3xl sm:text-4xl text-center mb-6 font-bold text-[#6B46C1] tracking-tight">
          🔍 Search Users & Arts
        </h1>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Search for users or arts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-[#2D2D2D] border border-gray-800/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#6B46C1] focus:ring-2 focus:ring-[#6B46C1]/50 transition-all duration-300"
          />
          <button
            onClick={() => fetchSearch(true)}
            className="px-4 py-2 rounded-lg bg-[#6B46C1] text-white font-semibold hover:bg-[#7C3AED] hover:shadow-[#6B46C1]/50 transition-all duration-300"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="flex justify-center my-4">
            <div className="w-8 h-8 border-4 border-t-[#6B46C1] border-gray-800 rounded-full animate-spin"></div>
          </div>
        )}
        {error && <p className="text-center mb-4 text-red-400 font-medium">{error}</p>}

        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6B46C1] mb-4 tracking-tight">
            Users
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {searchResult.users.length > 0 ? (
              searchResult.users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => window.location.href = `/profile/${user.username}`}
                  className="flex items-center p-2 bg-[#1A1A1A] rounded-lg border cursor-pointer border-gray-800/50 shadow-lg hover:shadow-[#6B46C1]/50 transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={`http://localhost:5000${user.avatarUrl}`}
                    alt={user.username}
                    className="w-14 h-14 rounded-full border-2 border-[#6B46C1]"
                  />
                  <div className="ml-2">
                    <h3 className="text-lg font-semibold text-gray-100">{user.username}</h3>
                    <p className="text-sm text-gray-400">{user.bio || "No bio"}</p>
                  </div>
                </div>
              ))
            ) : loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full h-20 bg-[#2D2D2D] rounded-lg animate-pulse"
                ></div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No users found.</p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800/50 my-4"></div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#6B46C1] mb-4 tracking-tight">
            Arts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {searchResult.arts.length > 0 ? (
              searchResult.arts.map((art) => (
                <div
                  key={art._id}
                  className="bg-[#1A1A1A] rounded-lg border border-gray-800/50 shadow-lg hover:shadow-[#6B46C1]/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="relative w-full pt-[100%] overflow-hidden">
                    <img
                      src={`http://localhost:5000${art.imageUrl}`}
                      alt={art.title}
                      className="absolute top-0 left-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-lg font-semibold text-[#6B46C1] truncate">{art.title}</h3>
                    {art.tags && art.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {art.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-[#2D2D2D] text-gray-100 text-xs rounded-full hover:bg-[#6B46C1] transition-all duration-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4 mt-2 text-gray-400">
                      <div className="flex items-center gap-1 hover:text-red-400 transition-all duration-300">
                        <FaHeart /> {art.likes || 0}
                      </div>
                      <div className="flex items-center gap-1 hover:text-[#6B46C1] transition-all duration-300">
                        <FaComment /> {art.comments?.length || 0}
                      </div>
                      <div className="flex items-center gap-1 hover:text-green-400 transition-all duration-300">
                        <FaEye /> {art.view || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full h-64 bg-[#2D2D2D] rounded-lg animate-pulse"
                ></div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No arts found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchComponent;