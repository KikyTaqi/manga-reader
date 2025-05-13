import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { USE_OFFICIAL_API } from "../config";

const MangaDetail = ({ mangaId, lang, onSelectChapter }) => {
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [readChapters, setReadChapters] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const from = location.state?.from || "/";

  const handleBack = () => {
    navigate(from);
  };

  useEffect(() => {
    const storedChapters =
      JSON.parse(localStorage.getItem(`readChapters-${mangaId}`)) || [];
    setReadChapters(storedChapters);
  }, [mangaId]);

  const markChapterAsRead = (chapterId) => {
    const updatedChapters = [...new Set([...readChapters, chapterId])];
    setReadChapters(updatedChapters);
    localStorage.setItem(
      `readChapters-${mangaId}`,
      JSON.stringify(updatedChapters)
    );
  };

  const resetReadChapters = () => {
    localStorage.removeItem(`readChapters-${mangaId}`);
    setReadChapters([]);
    setShowResetConfirm(false); // Tutup popup konfirmasi
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const useOfficialApi = true; // false = pakai API sendiri, true = pakai API MangaDex langsung

        const detailUrl = USE_OFFICIAL_API
          ? `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`
          : `/api/manga/detail?mangaId=${mangaId}&includes[]=cover_art`;

        const chapterUrl = USE_OFFICIAL_API
          ? `https://api.mangadex.org/manga/${mangaId}/feed?translatedLanguage[]=${lang}&order[chapter]=asc`
          : `/api/manga/chapter/feed?mangaId=${mangaId}&lang=${lang}&order[chapter]=asc`;

        const [mangaRes, chaptersRes] = await Promise.all([
          axios.get(detailUrl),
          axios.get(chapterUrl, {
            headers: {
              "Cache-Control": "no-cache",
            },
          }),
        ]);

        setManga(mangaRes.data?.data || null);
        setChapters(chaptersRes.data?.data || []);
      } catch (err) {
        console.error("Error fetching manga or chapters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mangaId, lang]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg text-gray-800 dark:text-white">Loading...</div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg text-red-600 dark:text-red-400">
          Manga not found.
        </div>
      </div>
    );
  }

  const title = manga.attributes.title.en || "No Title";
  const cover = manga.relationships.find((r) => r.type === "cover_art");
  const coverUrl = cover
    ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}.256.jpg`
    : "";

  const synopsis =
    manga.attributes.description?.[lang] || "No synopsis available.";
  const genres = manga.attributes.tags || [];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <button
        onClick={handleBack}
        className="inline-flex items-center px-4 py-2 mb-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
      >
        ← Back
      </button>

      <div className="flex flex-col sm:flex-row items-center mb-6">
        <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
          {!imageLoaded && (
            <div className="w-full aspect-[2/3] bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg" />
          )}
          {coverUrl && (
            <img
              src={coverUrl}
              alt="cover"
              referrerPolicy="no-referrer"
              loading="lazy"
              className={`w-full h-auto rounded-lg shadow-md transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0 absolute"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          )}
        </div>
        <div className="sm:w-2/3 sm:ml-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{synopsis}</p>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Genres:
            </h3>
            <ul className="flex flex-wrap gap-2">
              {genres.length > 0 ? (
                genres.map((genre) => (
                  <li
                    key={genre.id}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-sm text-gray-800 dark:text-white"
                  >
                    {genre.attributes.name?.[lang] ||
                      genre.attributes.name?.en ||
                      "Unknown"}
                  </li>
                ))
              ) : (
                <li className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-sm text-gray-800 dark:text-white">
                  No genres available
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Chapters:
          </h2>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Reset Read Chapters
          </button>
        </div>

        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md shadow-lg">
              <p>Are you sure you want to reset read chapters?</p>
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  onClick={resetReadChapters}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="mt-4 px-4 py-2 text-white rounded-md bg-gray-400 cursor-pointer"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        <ul className="space-y-2">
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <li key={chapter.id}>
                <button
                  onClick={() => {
                    markChapterAsRead(chapter.id);
                    onSelectChapter(chapter);
                  }}
                  className={`w-full text-left px-4 py-3 ${
                    readChapters.includes(chapter.id)
                      ? "bg-blue-300 dark:bg-blue-500 hover:bg-blue-200 dark:hover:bg-blue-400"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }  rounded-md border border-gray-300 dark:border-gray-600 shadow-sm transition-all duration-200`}
                >
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Chapter {chapter.attributes.chapter || "?"}
                  </span>
                  <span className="block text-sm text-gray-700 dark:text-gray-300">
                    {chapter.attributes.title || "No Title"}
                  </span>
                </button>
              </li>
            ))
          ) : (
            <li className="text-gray-500 dark:text-gray-300">
              No chapters available
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MangaDetail;
