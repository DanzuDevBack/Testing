import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).send("Missing url parameter");
    return;
  }

  try {
    const response = await fetch(url);

    // Set header agar dianggap audio streaming
    res.setHeader("Content-Type", "audio/mpeg");

    // Pipe langsung body response
    response.body.pipe(res);
  } catch (err) {
    console.error("Error streaming audio:", err);
    res.status(500).send("Failed to stream audio");
  }
}
