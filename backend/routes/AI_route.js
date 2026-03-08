import express from "express"
const router = express.Router();

import  ai_summery  from "../controller/ai_controller.js";
import  {FetchfromTMDB}  from "../services/tmdb.service.js";

import {
  predictOutcome,
  scoreMovie,
  generateExplanation
} from "../controller/ai/decisionEngine.js";

import createSession from  "../controller/ai/sessionstate.js";

router.post("/", async (req, res) => {
  try {
    console.log("INTENT RECEIVED:", req.body);

    const intent = req.body;
    const TMDB_URL = "https://api.themoviedb.org/3/trending/movie/week";

    const tmdbResponse = await FetchfromTMDB(TMDB_URL);
    const movies = tmdbResponse.results;

    const processed = movies.map(movie => {
      const outcome = predictOutcome(movie);
      const score = scoreMovie(intent, outcome, movie);

      return {
        id: movie.id,
        title: movie.title,
        score,
        outcome,
        explanation: generateExplanation(outcome, movie)
      };
    });

    processed.sort((a, b) => b.score - a.score);

// take top 5 candidates
const topCandidates = processed.slice(0, 5);

// pick one randomly
const best =
  topCandidates[Math.floor(Math.random() * topCandidates.length)];

    console.log("BEST SCORE:", best?.score);

    // 🔽 relaxed threshold for prediction-based system
    if (!best || best.score < 0.45) {
      return res.json({ needMoreInfo: true });
    }

    res.json({ recommendation: best });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/summarize",ai_summery)
export default router
