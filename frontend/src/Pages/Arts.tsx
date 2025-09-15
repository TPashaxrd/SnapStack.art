import { useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaComment, FaEye, FaHeart } from "react-icons/fa";

interface Comment {
  _id: string;
  comment: string;
  date: string;
  user: {
    _id: string;
    username: string;
    avatarUrl: string;
  };
}

export default function Arts() {
  const { id } = useParams<{ id: string }>();
  const [art, setArt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showArt, setShowArt] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", { withCredentials: true });
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Kullanıcı bilgisi alınamadı", err);
      }
    }
    fetchUser();
  }, []);

  
  useEffect(() => {
    async function fetchArt() {
      try {
        const res = await axios.get(`http://localhost:5000/api/arts/${id}`, { withCredentials: true });
        setArt(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchArt();
  }, [id]);
  

  async function SubmitReport(artId: string) {
    const reason = prompt("What's your reason?")
    if(!reason || !artId) {
      alert("All fields are required.")
      return;
    } 
    try {
      const res = await axios.post(
        "http://localhost:5000/api/report",
        { artId, reason },
        { withCredentials: true }
      )
      if(res.status === 201) {
        alert("Successfully your report has submitted.")
      }
    } catch (error: any) {
      alert(error.message)
    }
  }

  function ShowArtToggle() {
    setShowArt(!showArt)
  }

  useEffect(() => {
    async function postView() {
      await axios.patch(`http://localhost:5000/api/arts/view/${id}`);
    }
    postView();
  }, [id]);

  const postLike = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/arts/${id}/like`, {}, { withCredentials: true });
      const res = await axios.get(`http://localhost:5000/api/arts/${id}`, { withCredentials: true });
      setArt(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return alert("İf you want make comment, you need log in.");
  
    try {
      const res = await axios.post(
        `http://localhost:5000/api/arts/${id}/comment`,
        { comment: newComment, userId: currentUser._id },
        { withCredentials: true }
      );
      setArt({ ...art, comments: res.data.comments });
      setNewComment("");
    } catch (error) {
      console.error(error);
      alert("Yorum gönderilemedi.");
    }
  };
  

  if (loading) return <div className="min-h-screen items-center justify-center flex text-blue-500"><div className="lds-facebook"><div></div><div></div><div></div></div></div>;

  return (
    <>
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#6B46C1] rounded-full opacity-20 rotate-12 animate-pulse-slow blur-2xl"></div>
      <div className="absolute -bottom-28 -right-24 w-80 h-80 bg-[#7C3AED] rounded-full opacity-15 rotate-45 animate-pulse-slow blur-2xl"></div>
      <Header />
      <div className="bg-[#0F0F0F] flex items-center justify-center py-6">
      <button onClick={() => window.history.back() } className="relative px-8 py-3 rounded-xl font-semibold text-red-400 border border-red-500/40 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:text-white hover:bg-red-500/20 transition-all duration-300 group">
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-sm transition duration-300"></span>
        <span className="relative z-10 tracking-wider">⟵ BACK</span>
      </button>
      <button onClick={() => SubmitReport(art?._id)} className="bg-[#0F0F0F] px-2 py-2 text-red-500 font-inter text-xl hover:text-red-500/70">Report</button>
    </div>
      <div className="flex justify-center items-center min-h-screen bg-[#0F0F0F] font-inter px-4">
        <div className="mb-12 mt-11 w-full max-w-3xl bg-[#1A1A1A] backdrop-blur-lg rounded-2xl shadow-xl border border-gray-800/50 overflow-hidden">
          <div className="p-6 border-b border-gray-800/50">
            <h1 className="text-3xl font-bold text-center text-[#6B46C1] font-inter tracking-tight">
              {art?.title}
            </h1>
          </div>
  
          <div className="relative group">
            <img
              src={`http://localhost:5000${art?.imageUrl}`}
              alt={art?.title}
              onClick={ShowArtToggle}
              className="w-full h-[450px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
  
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={
                  art?.user?.avatarUrl
                    ? `http://localhost:5000${art.user.avatarUrl}`
                    : "https://cdn-icons-png.flaticon.com/512/1250/1250743.png"
                }
                alt="Avatar"
                className="w-14 h-14 rounded-full border-2 border-[#6B46C1]"
              />
              <div>
                <p className="text-gray-100 text-lg">
                  by{" "}
                  <a
                    href={`/profile/${art?.user?.username}`}
                    className="text-[#6B46C1] hover:text-[#7C3AED] hover:underline transition-all duration-300"
                  >
                    {art?.user?.username || "Deleted User"}
                  </a>
                </p>
                {art.tags.length > 0 && (
                  <p className="text-sm text-gray-400">#{art?.tags?.join(" #")}</p>
                )}
              </div>
            </div>
  
            <div className="flex justify-around text-gray-300 text-lg">
              <span className="flex gap-2 items-center hover:text-green-400 transition-all duration-300">
                <FaEye /> {art?.view}
              </span>
              <span
                onClick={postLike}
                className={`flex gap-2 items-center transition-all duration-300 cursor-pointer ${
                  art?.liked ? "text-red-400" : "text-gray-300 hover:text-red-400"
                }`}
              >
                <FaHeart /> {art?.likes}
              </span>
              <span className="flex gap-2 items-center hover:text-[#6B46C1] transition-all duration-300">
                <FaComment /> {art?.comments.length}
              </span>
            </div>
  
            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="mt-6 flex flex-col gap-2">
                <textarea
                  className="w-full p-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300"
                  placeholder={`Enter comment by ${currentUser?.user.username}`}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="self-end px-4 py-2 bg-[#6B46C1] hover:bg-[#7C3AED] rounded-lg text-white font-bold transition-all duration-300 shadow-lg hover:shadow-[#6B46C1]/50"
                >
                  Submit Comment
                </button>
              </form>
            ) : (
              <p className="text-gray-400 mt-4 text-center">
                To make a comment{" "}
                <a href="/login" className="text-[#6B46C1] hover:text-[#7C3AED] underline transition-all duration-300">
                  log in
                </a>.
              </p>
            )}
  
            <div className="mt-6 flex flex-col gap-4">
              {art.comments
                .slice()
                .reverse()
                .map((c: Comment) => (
                  <div key={c._id} className="flex gap-3 bg-[#2D2D2D]/50 p-3 rounded-lg border border-gray-800/50">
                    <img
                      src={`http://localhost:5000${c?.user?.avatarUrl}`}
                      alt={c?.user?.username}
                      className="w-10 h-10 rounded-full border-2 border-[#6B46C1]"
                    />
                    <div>
                      <p
                        onClick={() => (window.location.href = `/profile/${c?.user?.username || "Deleted User"}`)}
                        className="cursor-pointer hover:text-[#7C3AED] text-[#6B46C1] font-semibold hover:underline transition-all duration-300"
                      >
                        {c?.user?.username}
                      </p>
                      <p className="text-gray-300">{c?.comment}</p>
                      <p className="text-gray-500 text-xs">{new Date(c?.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
  
      {showArt && (
        <div
          onClick={ShowArtToggle}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 cursor-pointer"
        >
          <img src={`http://localhost:5000${art?.imageUrl}`} alt="Art Image" className="max-w-[90%] max-h-[90%] rounded-2xl shadow-xl" />
        </div>
      )}
    </>
  );
}