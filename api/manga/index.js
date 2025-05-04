export default async function handler(req, res) {
    const { title, limit = 12, offset = 0, lang } = req.query;
  
    const params = new URLSearchParams();
    params.append("limit", limit);
    params.append("offset", offset);
    params.append("includes[]", "cover_art");
    params.append("availableTranslatedLanguage[]", lang);
    if (title) params.append("title", title);
  
    const url = `https://api.mangadex.org/manga?${params}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch manga list" });
    }
  }
  