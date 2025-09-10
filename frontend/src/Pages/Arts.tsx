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
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 font-space-grotesk px-4">
        <div className="mb-12 mt-11 w-full mt-2 max-w-3xl bg-black/60 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
          
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-3xl font-bold text-center text-purple-400 font-inter">
              {art?.title}
            </h1>
          </div>

          <div className="relative group">
            <img
              src={`http://localhost:5000${art?.imageUrl}`}
              alt={art?.title}
              onClick={ShowArtToggle}
              className="w-full cursor-pointer h-[450px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                src={`http://localhost:5000${art?.user?.avatarUrl}`}
                alt="Avatar"
                className="w-14 h-14 rounded-full border-2 border-purple-500"
              />
              <div>
                <p className="text-white text-lg">
                  by{" "}
                  <a
                    href={`/profile/${art?.user?.username}`}
                    className="text-purple-300 hover:underline"
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
              <span className="flex gap-2 items-center hover:text-blue-400 transition">
                <FaEye /> {art?.view}
              </span>
              <span
                onClick={postLike}
                className={`flex gap-2 items-center transition cursor-pointer ${
                    art?.liked ? "text-red-500" : "text-gray-300 hover:text-red-500"
                }`}
                >
                <FaHeart /> {art?.likes}
                </span>
              <span className="flex gap-2 items-center hover:text-green-400 transition">
                <FaComment /> {art?.comments.length}
              </span>
            </div>

            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="mt-6 flex flex-col gap-2">
                <textarea
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                  placeholder={`Enter comment by ${currentUser?.user.username}`}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="self-end px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded text-white font-bold transition"
                >
                  Submit Comment
                </button>
              </form>
            ) : (
              <p className="text-gray-400 mt-4 text-center">
                To make a comment <a href="/login" className="text-purple-300 underline">log in</a>.
              </p>
            )}

            <div className="mt-6 flex flex-col gap-4">
              {art.comments
                .slice()
                .reverse()
                .map((c: Comment) => (
                  <div key={c._id} className="flex gap-3 bg-black/30 p-3 rounded">
                    <img
                      src={`http://localhost:5000${c?.user?.avatarUrl}`}
                      alt={c?.user?.username}
                      className="w-10 h-10 rounded-full border border-purple-500"
                    />
                    <div>
                      <p onClick={() => window.location.href = `/profile/${c?.user?.username}`} className="cursor-pointer hover:underline text-purple-300 font-semibold">{c?.user?.username}</p>
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
        <div onClick={ShowArtToggle} className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 cursor-pointer ">
          <img src={`http://localhost:5000${art?.imageUrl}`} alt="Art Image" />
        </div>
      )}

    </>
  );
}
