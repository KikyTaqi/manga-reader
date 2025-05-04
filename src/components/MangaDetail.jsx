import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const MangaDetail = ({ mangaId, lang, onSelectChapter }) => {
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleBack = () => {
    navigate(from);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [mangaRes, chaptersRes] = await Promise.all([
          axios.get(`/api/manga/detail?mangaId=${mangaId}&includes[]=cover_art`),
          axios.get(
            `/api/manga/chapter/feed?mangaId=${mangaId}&lang=${lang}&order[chapter]=asc`,
            {
              headers: {
                "Cache-Control": "no-cache",
              },
            }
          )
          .then((res) => {
            console.log("Chapters response:", res.data); // ← CEK DATA DI SINI
            setChapters(res.data.data || []);
          })
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

  const synopsis = manga.attributes.description || "No synopsis available.";
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
          {coverUrl && (
            <img
              src={coverUrl}
              alt="cover"
              referrerPolicy="no-referrer"
              className="w-full h-auto rounded-lg shadow-md"
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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Chapters:
        </h2>
        <ul className="space-y-2">
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <li key={chapter.id}>
                <button
                  onClick={() => onSelectChapter(chapter)}
                  className="w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm transition-all duration-200"
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
