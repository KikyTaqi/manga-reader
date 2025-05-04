export default async function handler(req, res) {
  const { mangaId, lang} = req.query;

  if (!mangaId) {
    return res.status(400).json({ error: "Missing mangaId" });
  }

  const url = `https://api.mangadex.org/manga/${mangaId}/feed?&translatedLanguage[]=${lang}&order[chapter]=asc`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Feed fetch error:", error);
    res.status(500).json({ error: "Failed to fetch manga feed" });
  }
}
