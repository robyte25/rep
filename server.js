import express from "express";
import Replicate from "replicate";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Static files (HTML, CSS, JS, favicon)
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

// Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// API endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const output = await replicate.run("minimax/video-01", {
      input: { prompt }
    });

    res.json({ url: output.url() });
  } catch (err) {
    console.error("Generation error:", err);
    res.status(500).json({ error: "Video generation failed" });
  }
});

// Fallback: send index.html for all unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
