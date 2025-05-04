export default async function handler(req, res) {
  try {
    const query = req.url.split('?')[1] || '';
    const apiUrl = `https://api.mangadex.org/manga?${query}`;

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: "Upstream API error" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Serverless API error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
