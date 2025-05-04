import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MangaList = ({ lang, searchQuery, pageNumber }) => {
  const [mangaList, setMangaList] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const params = new URLSearchParams();
        params.append("limit", 12);
        params.append("offset", (pageNumber - 1) * 12);
        params.append("includes[]", "cover_art");
        params.append("lang", lang);
        if (searchQuery) params.append("title", searchQuery);

        const res = await axios.get(`/api/manga?${params}`);
        setMangaList(res.data.data);
        setTotal(res.data.total);
      } catch (error) {
        console.error("Error fetching manga:", error);
      }
    };

    fetchManga();
  }, [lang, searchQuery, pageNumber]);

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                className="cursor-pointer block dark:text-white"
              >
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt="cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full aspect-w-2 aspect-h-3 object-cover rounded shadow-lg"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gray-300 rounded shadow-inner flex items-center justify-center text-xs text-gray-600">
                    No Cover
                  </div>
                )}
                <h3 className="text-sm mt-2">
                  {manga.attributes.title?.en || "No Title"}
                </h3>
              </Link>
            );
          })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6 dark:text-white">
        {pageNumber > 1 && (
          <Link
            to={
              searchQuery
                ? `/search?q=${searchQuery}&page=${pageNumber - 1}`
                : `/page/${pageNumber - 1}`
            }
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded hover:bg-gray-300"
          >
            Previous
          </Link>
        )}
        {pageNumber < totalPages && (
          <Link
            to={
              searchQuery
                ? `/search?q=${searchQuery}&page=${pageNumber + 1}`
                : `/page/${pageNumber + 1}`
            }
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded hover:bg-gray-300"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
};

export default MangaList;
