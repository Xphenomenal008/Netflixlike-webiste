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
  const intent = req.body;
  const session = createSession();
  const TMDB_URL = "https://api.themoviedb.org/3/trending/movie/week";
  const tmdb_res = await FetchfromTMDB(TMDB_URL);
  const movies=tmdb_res.results.slice(0,20)

  const processed = movies.map(movie => {
    const outcome = predictOutcome(movie);
    const score = scoreMovie(intent, outcome, movie, session);

    return {
      id: movie.id,
      title: movie.title,
      score,
      outcome,
      explanation: generateExplanation(outcome, movie)
    };
  });

  processed.sort((a, b) => b.score - a.score);

  const best = processed[0];

  if (!best || best.score < 0.65) {
    return res.json({ needMoreInfo: true });
  }

  res.json({ recommendation: best });
});

router.post("/summarize",ai_summery)
export default router
