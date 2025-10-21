import axios from "axios";

const ai_summery = async (req, res) => {
    console.log("Received text:", req.body.text);
  const { text } = req.body;
  try {
    // Summarize
    const summaryResponse = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const summary = summaryResponse.data[0]?.summary_text || "No summary available";

    // Emotion
    const emotionResponse = await axios.post(
      "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
      { inputs: summary },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const emotions = emotionResponse.data[0] || emotionResponse.data;
    // Find emotion with highest score
    const topEmotion =
      Array.isArray(emotions) && emotions.length
        ? emotions.reduce((a, b) => (a.score > b.score ? a : b))
        : { label: "unknown" };

    res.json({
      summary,
      mood: topEmotion.label,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI processing failed" });
  }
};
export default ai_summery