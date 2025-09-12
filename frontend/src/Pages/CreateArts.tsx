import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

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
    <>
      <div className="absolute -top-24 -left-24 w-44 h-44 bg-[#6B46C1] rounded-full opacity-20 rotate-45 animate-pulse-slow"></div>
      <div className="absolute -bottom-28 -right-20 w-80 h-80 bg-[#7C3AED] rounded-full opacity-15 rotate-12 animate-pulse-slow"></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#6B46C1]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse-slow"></div>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#0F0F0F] font-inter relative overflow-hidden">
        <div className="relative z-10 bg-[#1A1A1A] backdrop-blur-lg rounded-2xl shadow-xl border border-gray-800/50 p-10 max-w-md w-full flex flex-col gap-6">
          <span
            className="text-[#6B46C1] font-inter hover:text-[#7C3AED] hover:underline border border-gray-800/50 px-2 py-1 text-lg cursor-pointer rounded-lg transition-all duration-300"
            onClick={() => (window.location.href = "/")}
          >
            [BACK TO HOME]
          </span>
  
          <h1 className="text-4xl font-extrabold text-center text-[#6B46C1] tracking-tight">
            Upload Your Masterpiece
          </h1>
  
          {!user && (
            <p className="text-center text-red-400 font-semibold animate-pulse">
              You must be logged in to upload!
              <a className="text-[#6B46C1] hover:text-[#7C3AED] underline" href="/login">
                &nbsp;Log in.
              </a>
            </p>
          )}
  
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            style={{ opacity: user ? 1 : 0.5, pointerEvents: user ? "auto" : "none" }}
          >
            <div>
              <label className="block font-semibold text-gray-100 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Artwork Title"
                className="w-full px-5 py-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300 font-inter shadow-md hover:shadow-lg"
                required
              />
            </div>
  
            <div>
              <label className="block font-semibold text-gray-100 mb-1">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags, separated by commas"
                className="w-full px-5 py-3 rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300 font-inter shadow-md hover:shadow-lg"
              />
            </div>
  
            <div>
              <label className="block font-semibold text-gray-100 mb-1">Upload Image</label>
              <input
                title="Upload Image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                className="w-full text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#6B46C1] file:text-white hover:file:bg-[#7C3AED] transition-all duration-300 font-inter"
                required
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-[#6B46C1] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-[#6B46C1]/50 transform hover:-translate-y-1 transition-all duration-300"
            >
              Upload Masterpiece
            </button>
          </form>
  
          {message && (
            <p className="text-center text-gray-300 mt-3 font-medium text-lg animate-fadeIn">
              {message}
            </p>
          )}
  
          <p className="text-center text-sm text-gray-400 mt-4">
            SnapStack.art &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}