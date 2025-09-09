import axios from "axios";
import { useEffect, useState } from "react";
import { BiCamera } from "react-icons/bi";
import { BsPencil } from "react-icons/bs";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { GiDress } from "react-icons/gi";

export default function Footer() {
  const [email, setEmail] = useState("")
  const [IP_Address, setIP_Address] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [Successfully, setSuccessfully] = useState("")

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
      setEmail("")
      setSuccessfully("Successfully Submited!")
    } catch (err: any) {
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
    <footer className="bg-gray-900 text-gray-300 pt-12 relative z-50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        <div>
          <h2
            className="text-2xl md:text-3xl font-extrabold text-white mb-4 cursor-pointer hover:text-purple-400 transition-colors"
            onClick={() => (window.location.href = "/")}
          >
            SnapStack.art
          </h2>
          <p className="text-gray-400 text-sm">
            SnapStack.art is a creative platform for artists and enthusiasts to showcase, share, and explore stunning digital art.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "Gallery", "About Us", "Contact"].map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase().replace(/\s+/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Fashion", icon: <GiDress className="inline mr-2" /> },
              { name: "Photography", icon: <BiCamera className="inline mr-2" /> },
              { name: "Design", icon: <BsPencil className="inline mr-2" /> },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={`#${item.name.toLowerCase()}`}
                  className="hover:text-white transition-colors flex items-center"
                >
                  {item.icon} {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Stay Connected</h3>
          <p className="text-gray-400 text-sm mb-3">Subscribe to our newsletter for updates:</p>
          <span className="text-red-500 font-inter">{error}</span>
          <span className="text-blue-500 font-inter">{Successfully}</span>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="px-3 py-2 font-inter rounded-md text-gray-900 text-sm flex-1 focus:outline-none"
            />
            <button 
              type="button" 
              disabled={!IP_Address || loading}
              onClick={(e) => submitSubs(e)}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md transition-colors text-sm disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Subscribe"}
            </button>
          </form>
          <div className="flex gap-4 mt-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} SnapStack.art. All rights reserved. Designed with ❤️ by SnapStack Team.
      </div>
    </footer>
  );
}