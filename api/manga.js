export default async function handler(req, res) {
  const { mangaId, type = "detail", lang = "en" } = req.query;

  if (!mangaId) {
    return res.status(400).json({ error: "Missing mangaId" });
  }

  let url = "";

  if (type === "detail") {
    url = `https://api.mangadex.org/manga/${mangaId}?includes[]=cover_art`;
  } else if (type === "feed") {
    url = `https://api.mangadex.org/manga/${mangaId}/feed?translatedLanguage[]=${lang}&order[chapter]=asc`;
  } else {
    return res.status(400).json({ error: "Invalid type" });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Izinkan CORS (walau dari server, buat jaga-jaga)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Failed to fetch data from MangaDex" });
  }
}
