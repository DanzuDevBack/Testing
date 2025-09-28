import { Readable } from "stream";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).send("Missing url parameter");
    return;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      res.status(500).send("Failed to fetch audio");
      return;
    }

    res.setHeader("Content-Type", "audio/mpeg");

    // Convert ReadableStream → Node.js Readable
    const reader = response.body.getReader();
    const nodeStream = new Readable({
      async read() {
        try {
          const { done, value } = await reader.read();
          if (done) {
            this.push(null);
          } else {
            this.push(Buffer.from(value));
          }
        } catch (err) {
          this.destroy(err);
        }
      }
    });

    nodeStream.pipe(res);
  } catch (err) {
    console.error("Error streaming audio:", err);
    res.status(500).send("Failed to stream audio");
  }
}
