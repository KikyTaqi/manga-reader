export default async function handler(req, res) {
    const { mangaId } = req.query;
  
    const url = `https://api.mangadex.org/manga/e1e38166-20e4-4468-9370-187f985c550e?includes[]=cover_art`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch manga detail" });
    }
  }
  