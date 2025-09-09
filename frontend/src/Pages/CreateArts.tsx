import { useState, useEffect } from "react";
import axios from "axios";

export default function CreateArts() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", { withCredentials: true });
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setMessage("❌ You must login first!");
    if (!image) return setMessage("❌ Please select an image!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("tags", tags);
    formData.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/arts/create",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      setMessage("🎨 Masterpiece Uploaded! ID: " + res.data._id);
      setTitle(""); setTags(""); setImage(null);
      setTimeout(() => window.location.href = `/art/${res.data._id}`, 200);
    } catch (err: any) {
      setMessage("❌ Error: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <p className="text-center mt-12 text-xl font-medium text-purple-600">Checking login...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white/10 text-white backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full flex flex-col gap-6">
        <span className="text-blue-500 font-inter hover:text-blue-500/60 hover:underline border px-1 py-1 text-xl cursor-pointer border-black" onClick={() => window.location.href = "/"}>[BACK TO HOME]</span>
        <div className="absolute -top-24 -left-24 w-44 h-44 bg-purple-300 rounded-full opacity-20 rotate-45 animate-pulse-slow"></div>
        <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-pink-300 rounded-full opacity-15 rotate-12 animate-pulse-slow"></div>
        <h1 className="text-4xl font-extrabold text-center text-purple-700 tracking-wide drop-shadow-lg">
          Upload Your Art's!
        </h1>
  
        {!user && (
          <p className="text-center text-red-500 font-semibold animate-pulse">
            You must be logged in to upload!
            <a className="text-blue-500 hover:text-blue-500/60" href="/login">&nbsp;Log in.</a>
          </p>
        )}
  
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          style={{ opacity: user ? 1 : 0.5, pointerEvents: user ? "auto" : "none" }}
        >
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Artwork Title"
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm hover:shadow-md transition"
              required
            />
          </div>
  
          <div>
            <label className="block font-semibold mb-1">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Add tags, separated by commas"
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm hover:shadow-md transition"
            />
          </div>
  
          <div>
            <label className="block font-semibold mb-1">Upload Image</label>
            <input
              title="Upload File"
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files ? e.target.files[0] : null)}
              className="w-full text-gray-700 cursor-pointer hover:opacity-80 transition"
              required
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Upload Masterpiece
          </button>
        </form>
  
        {message && (
          <p className="text-center text-gray-700 mt-3 font-medium text-lg animate-fadeIn">{message}</p>
        )}
  
        <p className="text-center text-sm text-gray-400 mt-4">
          SnapStack.art &copy; 2025
        </p>
      </div>
    </div>
  );
  
}