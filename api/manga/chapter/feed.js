export default async function handler(req, res) {
  const { mangaId, ...restQuery } = req.query;

  if (!mangaId) {
    return res.status(400).json({ error: "Missing mangaId" });
  }

  // Build query string (support for lang, limit, order, etc.)
  const queryString = new URLSearchParams({
    ...restQuery,
    [`translatedLanguage[]`]: restQuery.lang || "en",
    [`order[chapter]`]: "asc",
  });

  const url = `https://api.mangadex.org/manga/${mangaId}/feed?${queryString.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Feed fetch error:", error);
    res.status(500).json({ error: "Failed to fetch manga feed" });
  }
}
