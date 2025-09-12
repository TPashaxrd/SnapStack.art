import axios from "axios";
import { useEffect, useState } from "react";
import { BiCamera } from "react-icons/bi";
import { BsPencil } from "react-icons/bs";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { GiDress } from "react-icons/gi";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [IP_Address, setIP_Address] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [Successfully, setSuccessfully] = useState("");

  async function submitSubs(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!email || !IP_Address) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/subs/subscribe", {
        email,
        IP_Address,
      });
      console.log("Subscription success:", res.data);
      setError("");
      setEmail("");
      setSuccessfully("Successfully Subscribed!");
    } catch (err: any) {
      setSuccessfully("");
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => setIP_Address(response.data.ip))
      .catch((err) => console.error("Error fetching IP:", err));
  }, []);

  return (
    <>
      <div className="border-t border-gray-800/50"></div>
      <footer className="bg-[#0F0F0F] text-gray-100 font-inter pt-12 relative z-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h2
              className="text-2xl md:text-3xl font-extrabold text-gray-100 mb-4 cursor-pointer hover:text-[#6B46C1] transition-all duration-300 tracking-tight"
              onClick={() => (window.location.href = "/")}
            >
              SnapStack.art
            </h2>
            <p className="text-gray-400 text-sm">
              SnapStack.art is a creative platform for artists and enthusiasts to showcase, share, and explore stunning digital art.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-100 mb-3 tracking-tight">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {["Home", "Gallery", "About Us", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase().replace(/\s+/g, "")}`}
                    className="hover:text-[#6B46C1] text-gray-300 duration-300 transition-all"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-100 mb-3 tracking-tight">Explore</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Fashion", icon: <GiDress className="inline mr-2" /> },
                { name: "Photography", icon: <BiCamera className="inline mr-2" /> },
                { name: "Design", icon: <BsPencil className="inline mr-2" /> },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={`#${item.name.toLowerCase()}`}
                    className="hover:text-[#6B46C1] text-gray-300 duration-300 transition-all flex items-center"
                  >
                    {item.icon} {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-100 mb-3 tracking-tight">Stay Connected</h3>
            <p className="text-gray-400 text-sm mb-3">Subscribe to our newsletter for updates:</p>
            <span className="text-red-400 font-inter">{error}</span>
            <span className="text-green-400 font-inter">{Successfully}</span>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="px-3 py-2 font-inter rounded-lg bg-[#2D2D2D] text-gray-100 border border-gray-800/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all"
              />
              <button
                type="button"
                disabled={!IP_Address || loading}
                onClick={(e) => submitSubs(e)}
                className="bg-[#6B46C1] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Subscribe"}
              </button>
            </form>
            <div className="flex gap-4 mt-4">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="text-gray-400 hover:text-[#6B46C1] transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800/50 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} SnapStack.art. All rights reserved. Designed with ❤️ by SnapStack Team.
        </div>
      </footer>
    </>
  );
}