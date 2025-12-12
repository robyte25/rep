import express from "express";
import Replicate from "replicate";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Replicate client (ein API-Key reicht jetzt)
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// ✅ Stable Video Diffusion Endpoint
app.post("/api/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const output = await replicate.run(
      "stability-ai/stable-video-diffusion",
      {
        input: {
          prompt,
          motion_bucket_id: 127,
          fps: 24,
          num_frames: 25
        }
      }
    );

    if (!output || !output[0] || !output[0].url) {
      return res.status(500).json({ error: "Keine Video-URL erhalten." });
    }

    res.json({ url: output[0].url });
  } catch (err) {
    console.error("Generation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Fallback: index.html für alle Routen
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
