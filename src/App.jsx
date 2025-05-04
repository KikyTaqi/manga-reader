import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import MangaDetailPage from "./pages/MangaDetailPage";
import ReaderPage from "./pages/ReaderPage";
import { CiSearch } from "react-icons/ci";
import { FaMoon, FaSun } from "react-icons/fa";

function App() {
  const [lang, setLang] = useState("id");
  const [searchQuery, setSearchQuery] = useState(""); // State untuk pencarian
  const [isDarkMode, setIsDarkMode] = useState(false); // State untuk dark mode
  const location = useLocation();
  const navigate = useNavigate(); // tambahkan ini jika belum ada

  // Ambil dari localStorage saat load pertama
  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang) {
      setLang(storedLang);
    }

    // Ambil preferensi dark mode dari localStorage
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(storedDarkMode);
  }, []);

  // Simpan ke localStorage saat user mengganti bahasa
  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    localStorage.setItem("lang", newLang);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  // Cek apakah sedang di halaman reader
  const isReaderPage = location.pathname.startsWith("/chapter/");

  // Set kelas `dark` di body jika mode gelap aktif
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="dark:bg-gray-800 transition-colors duration-500 ease-in-out min-h-screen">
      {/* Tampilkan dropdown hanya jika bukan di halaman reader */}
      {!isReaderPage && (
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center sticky top-0  bg-opacity-60 dark:bg-opacity-60 backdrop-blur-lg z-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = searchQuery.trim();
              if (trimmed) {
                navigate(`/search?q=${encodeURIComponent(trimmed)}`);
              } else {
                navigate("/");
              }
            }}
            className="flex gap-2 w-full sm:w-auto mb-4 sm:mb-0"
          >
            <div className="flex items-center w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded rounded-r-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Manga"
                className="px-2 py-1 w-full rounded-l-md dark:bg-gray-800 dark:text-white bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                <CiSearch />
              </button>
            </div>
          </form>

          <select
            value={lang}
            onChange={handleLangChange}
            className="border border-gray-300 dark:border-gray-600 px-2 py-1 rounded w-full sm:w-auto dark:bg-gray-800 dark:text-white mb-4"
          >
            <option value="id" className="font-emoji">
              🇮🇩 Indonesia
            </option>
            <option value="en" className="font-emoji">
              🇬🇧 English
            </option>
          </select>

          {/* Toggle Dark Mode */}
          <button
            onClick={toggleDarkMode}
            className="ml-4 p-2 bg-gray-200 rounded dark:bg-gray-600 dark:text-white"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Home
              lang={lang}
              searchQuery={searchQuery}
              isDarkMode={isDarkMode}
            />
          }
        />
        <Route
          path="/page/:pageNumber"
          element={<Home lang={lang} isDarkMode={isDarkMode} />}
        />
        <Route
          path="/search"
          element={
            <Home
              lang={lang}
              searchQuery={searchQuery}
              isDarkMode={isDarkMode}
            />
          }
        />
        <Route path="/manga/:id" element={<MangaDetailPage lang={lang} />} />
        <Route path="/chapter/:id/page/:pageNumber" element={<ReaderPage />} />
      </Routes>
    </div>
  );
}

export default App;
