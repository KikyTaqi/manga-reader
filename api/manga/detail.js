export default async function handler(req, res) {
  const { mangaId, ...restQuery } = req.query;

  if (!mangaId) {
    return res.status(400).json({ error: "Missing mangaId" });
  }

  // Build query string (e.g. includes[]=cover_art)
  const queryString = new URLSearchParams(restQuery).toString();
  const url = `https://api.mangadex.org/manga/${mangaId}?${queryString}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch manga detail" });
  }
}
