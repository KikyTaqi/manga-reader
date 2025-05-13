import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { USE_OFFICIAL_API } from "../config";

const MangaList = ({ lang, searchQuery, pageNumber }) => {
  const [mangaList, setMangaList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [sectionTitle, setSectionTitle] = useState("Recently Added");

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const params = new URLSearchParams();
        params.append("limit", 12);
        params.append("offset", (pageNumber - 1) * 12);
        params.append("includes[]", "cover_art");

        if (searchQuery) {
          params.append("title", searchQuery);
          setSectionTitle(`Search Results for "${searchQuery}"`);
        } else {
          setSectionTitle("Recently Added");
        }

        let res;

        if (USE_OFFICIAL_API) {
          res = await axios.get(
            `https://api.mangadex.org/manga?${params.toString()}`
          );
        } else {
          params.append("lang", lang);
          res = await axios.get(`/api/manga?${params.toString()}`);
        }

        setMangaList(res.data.data);
        setTotal(res.data.total);
        setLoadedImages({});
      } catch (error) {
        console.error("Error fetching manga:", error);
      }
    };

    fetchManga();
  }, [lang, searchQuery, pageNumber]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageNumber]);

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        {sectionTitle}
      </h2>

      {/* Manga Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
        {Array.isArray(mangaList) &&
          mangaList.map((manga) => {
            const cover = manga.relationships.find(
              (r) => r.type === "cover_art"
            );
            const fileName = cover?.attributes?.fileName;

            const coverUrl = fileName
              ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
              : null;

            return (
              <Link
                key={manga.id}
                to={`/manga/${manga.id}`}
                state={{ from: window.location.pathname }}
                className="group cursor-pointer block text-sm dark:text-white"
              >
                <div className="relative w-full aspect-[2/3] rounded-md overflow-hidden shadow-md bg-gray-100 dark:bg-gray-800">
                  {!loadedImages[manga.id] && (
                    <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-700" />
                  )}
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt="cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onLoad={() =>
                        setLoadedImages((prev) => ({
                          ...prev,
                          [manga.id]: true,
                        }))
                      }
                      className={`w-full h-full object-cover transition duration-300 ${
                        loadedImages[manga.id]
                          ? "opacity-100"
                          : "opacity-0"
                      } group-hover:scale-[1.03] group-hover:brightness-110`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">
                      No Cover
                    </div>
                  )}
                </div>
                <h3 className="mt-2 text-xs sm:text-sm font-medium leading-tight line-clamp-2">
                  {manga.attributes.title?.en || "No Title"}
                </h3>
              </Link>
            );
          })}
      </div>

      {/* Pagination */}
      {(!searchQuery && totalPages > 1) && (
        <div className="flex justify-center gap-2 mt-6 dark:text-white">
          {pageNumber > 1 && (
            <Link
              to={`/page/${pageNumber - 1}`}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded hover:bg-gray-300"
            >
              Previous
            </Link>
          )}
          {pageNumber < totalPages && (
            <Link
              to={`/page/${pageNumber + 1}`}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded hover:bg-gray-300"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MangaList;
