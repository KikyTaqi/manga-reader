import { useEffect, useState } from "react";
import axios from "axios";
import { USE_OFFICIAL_API } from "../config";

const Reader = ({ chapterId, pageNumber, onPageChange, onBackToManga }) => {
  const [pages, setPages] = useState([]);
  const [mode, setMode] = useState("fit");
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true); // untuk transisi halus


  useEffect(() => {
    const fetchPages = async () => {
      // const useOfficialApi = true; // 🔁 Ubah ke false untuk pakai API internal
  
      try {
        let baseUrl, chapter;
  
        if (USE_OFFICIAL_API) {
          // 1. Fetch base URL
          const res = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
          baseUrl = res.data.baseUrl;
          chapter = res.data.chapter;
  
          if (!baseUrl || !chapter?.hash || !chapter?.data?.length) {
            console.error("Invalid MangaDex response", { baseUrl, chapter });
            return;
          }
  
          const urls = chapter.data.map(
            (img) => `${baseUrl}/data/${chapter.hash}/${img}`
          );
          setPages(urls);
        } else {
          // Gunakan API internal
          const res = await axios.get(`/api/manga/reader?chapterId=${chapterId}`);
          baseUrl = res.data.baseUrl;
          chapter = res.data.chapter;
  
          if (!baseUrl || !chapter?.hash || !chapter?.data?.length) {
            console.error("Invalid internal API response", res.data);
            return;
          }
  
          const urls = chapter.data.map(
            (img) => `${baseUrl}/data/${chapter.hash}/${img}`
          );
          setPages(urls);
        }
      } catch (err) {
        console.error("Error fetching reader pages:", err);
      }
    };
  
    fetchPages();
  }, [chapterId]);
  

  // useEffect(() => {
  //   axios
  //     .get(`/api/manga/reader?chapterId=${chapterId}`)
  //     .then((res) => {
  //       const { baseUrl, chapter } = res.data;
  //       if (!baseUrl || !chapter?.hash || !chapter?.data?.length) {
  //         console.error("Invalid response format", res.data);
  //         return;
  //       }
  
  //       const urls = chapter.data.map(
  //         (img) => `${baseUrl}/data/${chapter.hash}/${img}`
  //       );
  //       setPages(urls);
  //     })
  //     .catch((err) => {
  //       console.error("Reader API error:", err);
  //     });
  // }, [chapterId]);
  

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageNumber]);

  useEffect(() => {
    setIsLoading(true);
    setShowOverlay(true);
  }, [pageNumber]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "f" || e.key === "F") {
        toggleMode();
      } else if (e.key === "ArrowRight") {
        if (pageNumber < pages.length) {
          onPageChange(pageNumber + 1);
        } else {
          onBackToManga();
        }
      } else if (e.key === "ArrowLeft") {
        if (pageNumber > 1) {
          onPageChange(pageNumber - 1);
        } else {
          onBackToManga();
        }
      } else if (e.key === "Escape") {
        onBackToManga();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pageNumber, pages.length]);

  const handleImageLoad = () => {
    // delay kecil untuk menghindari flicker (misalnya gambar sudah cached)
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowOverlay(false), 300); // delay hilangnya overlay biar smooth
    }, 150);
  };

  const handleClick = (e) => {
    const screenMiddle = window.innerWidth / 2;
    if (e.clientX < screenMiddle) {
      pageNumber > 1 ? onPageChange(pageNumber - 1) : onBackToManga();
    } else {
      pageNumber < pages.length
        ? onPageChange(pageNumber + 1)
        : onBackToManga();
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "fit" ? "full" : "fit"));
  };

  return (
    <div
      className="w-full h-full bg-black relative overflow-hidden"
      onClick={handleClick}
    >
      <div
        className={`w-full h-full flex items-center justify-center overflow-auto ${
          mode === "full" ? "overflow-x-hidden" : ""
        }`}
      >
        {pages.length > 0 && (
          <img
            src={pages[pageNumber - 1]}
            alt={`Page ${pageNumber}`}
            referrerPolicy="no-referrer"
            onLoad={handleImageLoad}
            className={`select-none pt-16 sm:pt-0 ${
              mode === "fit" ? "max-h-screen" : "w-full object-contain"
            }`}
          />
        )}

        {/* Overlay loading */}
        {showOverlay && (
          <div
            className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-40 pointer-events-none transition-opacity duration-300 ${
              isLoading ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="text-white text-sm animate-pulse">Loading...</div>
          </div>
        )}
      </div>

      <div className="fixed top-0 left-0 w-full flex justify-between p-4 pointer-events-none z-50">
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBackToManga();
            }}
            className="bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded border border-gray-700"
          >
            ← Back
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMode();
            }}
            className="bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded border border-gray-700 sm:block"
          >
            Mode: {mode === "fit" ? "Tinggi" : "Lebar"}
          </button>
        </div>

        <div className="pointer-events-auto">
          <span className="bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded border border-gray-700">
            Page {pageNumber} / {pages.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Reader;
