import { BiCamera } from "react-icons/bi";
import { BsPencil } from "react-icons/bs";
import { FaBell, FaUpload, FaUser } from "react-icons/fa";
import { GiDress } from "react-icons/gi";

export default function Footer() {
  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex bg-gray-900 rounded-full shadow-xl p-3 gap-6 md:hidden z-50">
        <FaUpload
          onClick={() => (window.location.href = "/create-arts")}
          className="cursor-pointer hover:text-purple-400 transition-all duration-300 text-2xl"
        />
        <FaBell className="cursor-pointer hover:text-yellow-400 transition-all duration-300 text-2xl" />
        <FaUser
          onClick={() => (window.location.href = "/profile")}
          className="cursor-pointer hover:text-blue-400 transition-all duration-300 text-2xl"
        />
      </div>

      <footer className="bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 text-white py-8 mt-12 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-3xl font-extrabold tracking-wide hover:scale-105 transition-transform cursor-pointer">
            SnapStack.art
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-lg font-medium">
            <a href="#" className="hover:text-gray-200 transition-colors">Home</a>
            <a href="#" className="hover:text-gray-200 transition-colors">Gallery</a>
            <a href="#" className="hover:text-gray-200 transition-colors">About</a>
            <a href="#" className="hover:text-gray-200 transition-colors">Contact</a>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:scale-110 transition-transform text-white">
              <GiDress size={28} />
            </a>
            <a href="#" className="hover:scale-110 transition-transform text-white">
              <BiCamera size={28} />
            </a>
            <a href="#" className="hover:scale-110 transition-transform text-white">
              <BsPencil size={24} />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-300 text-sm">
          &copy; {new Date().getFullYear()} SnapStack.art. All rights reserved.
        </div>
      </footer>
    </>
  );
}
