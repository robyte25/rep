import express from "express";
import Replicate from "replicate";

const app = express();
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

app.post("/api/generate", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const output = await replicate.run("minimax/video-01", {
      input: { prompt }
    });

    res.json({ url: output.url() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Generation failed" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
