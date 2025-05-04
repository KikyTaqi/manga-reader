export default async function handler(req, res) {
    const targetUrl = `https://api.mangadex.org${req.url.replace("/api/manga", "")}`;
  
    try {
      const response = await fetch(targetUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({
        error: "Proxy request failed",
        details: error.message,
      });
    }
  }
  