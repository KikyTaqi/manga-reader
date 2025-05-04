export default async function handler(req, res) {
  const { mangaId, lang, limit, offset } = req.query;

  if (!mangaId) {
    return res.status(400).json({ error: "Missing mangaId" });
  }

  const params = new URLSearchParams();
  if (limit) params.append("limit", limit);
  if (offset) params.append("offset", offset);
  params.append("translatedLanguage[]", lang);
  params.append("order[chapter]", "asc");

  const url = `https://api.mangadex.org/manga/${mangaId}/feed?${params.toString()}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Feed fetch error:", error);
    res.status(500).json({ error: "Failed to fetch manga feed" });
  }
}
