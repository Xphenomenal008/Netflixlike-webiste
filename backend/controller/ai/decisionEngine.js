export function predictOutcome(movie) {
  const runtime = movie.runtime || 120;
  const genres = movie.genres || [];

  let effort = runtime < 100 ? "low" : runtime > 140 ? "high" : "medium";
  let payoff = "neutral";

  if (genres.includes("Comedy")) payoff = "comfort";
  if (genres.includes("Action") || genres.includes("Thriller")) payoff = "thrill";
  if (genres.includes("Drama")) payoff = "inspiration";

  const energy_after =
    payoff === "comfort" ? "calm" :
    payoff === "thrill" ? "hyped" : "neutral";

  return { effort, payoff, energy_after };
}

export function scoreMovie(intent, outcome, movie, session) {
  let score = 0;

  if (intent.energy === "low" && outcome.effort === "low") score += 0.4;
  if (intent.goal === outcome.payoff) score += 0.4;
  if (intent.attention === "short" && movie.runtime < 100) score += 0.2;

  if (session.rejectedPayoffs.includes(outcome.payoff)) score -= 0.3;

  return Math.max(0, Math.min(score, 1));
}

export function generateExplanation(outcome, movie) {
  if (movie.runtime < 100)
    return "Short runtime means you can watch without a big time commitment.";

  if (outcome.payoff === "comfort")
    return "This gives a calming, low-effort experience.";

  if (outcome.payoff === "thrill")
    return "High-energy pacing keeps you engaged.";

  return "Balanced watch suited to your current intent.";
}

 