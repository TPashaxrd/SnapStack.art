import { BiCamera } from "react-icons/bi";
import { BsPencil } from "react-icons/bs";
import { FaBell, FaUpload, FaUser } from "react-icons/fa";
import { GiDress } from "react-icons/gi";

export default function Footer() {
    return (
      <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex bg-gray-800 rounded-full shadow-lg p-2 gap-6 md:hidden">
        <FaUpload className="cursor-pointer hover:text-purple-300 transition text-xl" />
        <FaBell className="cursor-pointer hover:text-yellow-400 transition text-xl" />
        <FaUser className="cursor-pointer hover:text-blue-400 transition text-xl" />
      </div>
      <footer className="bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 text-white py-6 mt-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          
          <div className="mb-4 md:mb-0 text-2xl font-bold">
            SnapStack.art
          </div>
  
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-gray-400 transition">Home</a>
            <a href="#" className="hover:text-gray-400 transition">Gallery</a>
            <a href="#" className="hover:text-gray-400 transition">About</a>
            <a href="#" className="hover:text-gray-400 transition">Contact</a>
          </div>
  
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-400 transition"><GiDress size={25} className="text-white" /></a>
            <a href="#" className="hover:text-gray-400 transition"><BiCamera size={25} className="text-white" /></a>
            <a href="#" className="hover:text-gray-400 transition"><BsPencil size={20} className="text-white" /></a>
          </div>
        </div>
  
        <div className="mt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SnapStack.art. Tüm hakları saklıdır.
        </div>
      </footer>
      </>
  )
}  