export default function Footer() {
    return (
      <footer className="bg-gradient-to-br from-purple-700 via-pink-500 to-orange-400 text-white py-6 mt-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          
          <div className="mb-4 md:mb-0 text-2xl font-bold">
            SnapStack.art
          </div>
  
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-gray-400 transition">Ana Sayfa</a>
            <a href="#" className="hover:text-gray-400 transition">Galeriler</a>
            <a href="#" className="hover:text-gray-400 transition">Hakkımızda</a>
            <a href="#" className="hover:text-gray-400 transition">İletişim</a>
          </div>
  
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-400 transition">🐦</a>
            <a href="#" className="hover:text-gray-400 transition">📸</a>
            <a href="#" className="hover:text-gray-400 transition">🎨</a>
          </div>
        </div>
  
        <div className="mt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SnapStack.art. Tüm hakları saklıdır.
        </div>
      </footer>
  )
}  