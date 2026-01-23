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

  // 🔥 FIX: convert genre_ids → genre names
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

  const energy_after =
    payoff === "comfort" ? "calm" :
    payoff === "thrill" ? "hyped" : "neutral";

  return { effort, payoff, energy_after };
}

export function scoreMovie(intent, outcome, movie) {
  let score = 0;

  if (intent.energy === "low" && outcome.effort === "low") score += 0.4;
  if (intent.goal === outcome.payoff) score += 0.4;
  if (intent.attention === "short" && movie.runtime < 100) score += 0.2;

  // 🔥 strong booster for relax + comfort
  if (intent.goal === "relax" && outcome.payoff === "comfort") {
    score += 0.3;
  }

  return Math.min(score, 1);
}

export function generateExplanation(outcome, movie) {
  if (outcome.payoff === "comfort")
    return "A light, calming watch that helps you relax without mental effort.";

  if (outcome.payoff === "thrill")
    return "Fast-paced and engaging, keeps your attention high.";

  if (outcome.payoff === "inspiration")
    return "Emotionally rich and meaningful, best for focused viewing.";

  return "Balanced watch that fits your current mood.";
}
