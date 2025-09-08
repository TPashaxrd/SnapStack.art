import { useState, useEffect } from "react";
import axios from "axios";

export default function CreateArts() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Login kontrolü
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 space-y-8 relative overflow-hidden">
        {/* Decorative brushes */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-200 rounded-full opacity-30 rotate-45"></div>
        <div className="absolute -bottom-24 -right-16 w-72 h-72 bg-pink-200 rounded-full opacity-20 rotate-12"></div>

        <h1 className="text-4xl font-extrabold text-center text-purple-700 tracking-wide">
          Upload Your Masterpiece
        </h1>

        {!user && (
          <p className="text-center text-red-500 font-semibold">
            You must be logged in to upload!
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          style={{ opacity: user ? 1 : 0.5, pointerEvents: user ? "auto" : "none" }}
        >
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Artwork Title"
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Add tags, separated by commas"
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files ? e.target.files[0] : null)}
              className="w-full text-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full transition duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 rounded-2xl transition-all duration-300 shadow-lg"
          >
            Upload Masterpiece
          </button>
        </form>

        {message && (
          <p className="text-center text-gray-700 mt-3 font-medium text-lg">{message}</p>
        )}

        <p className="text-center text-sm text-gray-400 mt-4">
          SnapStack.art &copy; 2025
        </p>
      </div>
    </div>
  );
}