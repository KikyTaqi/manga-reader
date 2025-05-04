export default async function handler(req, res) {
    const { chapterId} = req.query;
    
    const url = `https://api.mangadex.org/at-home/server/${chapterId}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Feed fetch error:", error);
      res.status(500).json({ error: "Failed to fetch manga feed" });
    }
  }
  