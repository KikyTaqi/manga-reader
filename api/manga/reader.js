// Next.js API Route or Express Handler

import axios from "axios";

export default async function handler(req, res) {
  const { chapterId } = req.query;

  if (!chapterId) {
    return res.status(400).json({ error: "chapterId is required" });
  }

  try {
    const response = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
    const { baseUrl, chapter } = response.data;

    const pages = chapter.data.map(
      (fileName) => `${baseUrl}/data/${chapter.hash}/${fileName}`
    );

    res.status(200).json({ pages });
  } catch (error) {
    console.error("Error fetching chapter data:", error.message);
    res.status(500).json({ error: "Failed to load chapter data." });
  }
}
