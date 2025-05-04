import { useEffect, useState } from "react";
import axios from "axios";

const Reader = ({ chapterId, pageNumber, onPageChange, onBackToManga }) => {
  const [pages, setPages] = useState([]);
  const [mode, setMode] = useState("fit");
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await axios.get(`/api/at-home/server/${chapterId}`); // proxy endpoint
        const { baseUrl, chapter } = res.data;
        const urls = chapter.data.map(
          (img) => `${baseUrl}/data/${chapter.hash}/${img}`
        );
        setPages(urls);
      } catch (error) {
        console.error("Failed to fetch chapter images:", error);
      }
    };

    fetchChapter();
  }, [chapterId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsLoading(true);
    setShowOverlay(true);
  }, [pageNumber]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "f" || e.key === "F") {
        toggleMode();
      } else if (e.key === "ArrowRight") {
        pageNumber < pages.length ? onPageChange(pageNumber + 1) : onBackToManga();
      } else if (e.key === "ArrowLeft") {
        pageNumber > 1 ? onPageChange(pageNumber - 1) : onBackToManga();
      } else if (e.key === "Escape") {
        onBackToManga();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pageNumber, pages.length]);

  const handleImageLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowOverlay(false), 300);
    }, 150);
  };

  const handleClick = (e) => {
    const screenMiddle = window.innerWidth / 2;
    if (e.clientX < screenMiddle) {
      pageNumber > 1 ? onPageChange(pageNumber - 1) : onBackToManga();
    } else {
      pageNumber < pages.length ? onPageChange(pageNumber + 1) : onBackToManga();
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
            onLoad={handleImageLoad}
            className={`select-none pt-13 sm:pt-0 ${
              mode === "fit" ? "max-h-screen" : "w-full object-contain"
            }`}
          />
        )}

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
            className="bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded"
          >
            ← Back
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMode();
            }}
            className="bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded sm:block"
          >
            Mode: {mode === "fit" ? "Tinggi" : "Lebar"}
          </button>
        </div>

        <div className="pointer-events-auto">
          <span className="bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded">
            Page {pageNumber} / {pages.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Reader;
