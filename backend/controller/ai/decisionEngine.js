// services/decisionEngine.js

const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  18: "Drama",
  10751: "Family",
  53: "Thriller",
  10749: "Romance",
};

export function predictOutcome(movie) {
  const runtime = movie.runtime || 120;

  const genres =
    movie.genre_ids?.map(id => GENRE_MAP[id]).filter(Boolean) || [];

  let effort = "medium";
  let payoff = "neutral";

  if (runtime < 100) effort = "low";
  if (runtime > 140) effort = "high";

  if (genres.includes("Comedy") || genres.includes("Family"))
    payoff = "comfort";

  if (genres.includes("Action") || genres.includes("Thriller"))
    payoff = "thrill";

  if (genres.includes("Drama"))
    payoff = "inspiration";

  // ⭐ fallback using rating (prediction logic)
  if (payoff === "neutral" && movie.vote_average >= 7) {
    payoff = "comfort";
  }

  const energy_after =
    payoff === "comfort" ? "calm" :
    payoff === "thrill" ? "hyped" : "neutral";

  return { effort, payoff, energy_after };
}

export function scoreMovie(intent, outcome, movie) {
  let score = 0;

  // 🔮 prediction signals
  const ratingScore = (movie.vote_average || 0) / 10;       // 0–1
  const popularityScore = Math.min((movie.popularity || 0) / 1000, 1);
  const voteScore = Math.min((movie.vote_count || 0) / 5000, 1);

  const predictionScore =
    ratingScore * 0.5 +
    popularityScore * 0.3 +
    voteScore * 0.2;

  score += predictionScore;

  // intent alignment (light boost)
  if (intent.goal === outcome.payoff) score += 0.2;
  if (intent.energy === "low" && outcome.effort === "low") score += 0.1;

  return Math.min(score, 1);
}

export function generateExplanation(outcome, movie) {
  if (outcome.payoff === "comfort")
    return "Highly rated and easy to watch — good for relaxing without stress.";

  if (outcome.payoff === "thrill")
    return "Popular and high-energy, keeps you engaged throughout.";

  if (outcome.payoff === "inspiration")
    return "Strong ratings and emotional depth make this a meaningful watch.";

  return "Well-rated and trending, a safe choice to watch now.";
}
