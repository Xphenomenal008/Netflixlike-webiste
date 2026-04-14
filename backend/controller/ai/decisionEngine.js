/**
 * Production-Grade Decision Engine for Movie Recommendations
 * Features:
 * - Hybrid filtering (content + collaborative)
 * - Mood & vibe detection
 * - Genre affinity scoring
 * - Trending & seasonal factors
 * - User preference learning
 * - Diversity scoring
 * - Cold-start handling
 */

import { getGenreMap, getGenreWeights } from "./genreWeights.js";
import { calculateSimilarityScore } from "./contentSimilarity.js";
import { getTrendingScore, getSeasonalFactor } from "./trendingAnalyzer.js";

const GENRE_MAP = getGenreMap();
const MIN_RECOMMENDATION_SCORE = 0.15;

/**
 * Advanced outcome prediction based on movie metadata
 */
export function predictOutcome(movie, userProfile = {}) {
  const runtime = movie.runtime || 120;
  const genres = movie.genre_ids?.map(id => GENRE_MAP[id]).filter(Boolean) || [];
  const voteAverage = movie.vote_average || 0;
  const voteCount = movie.vote_count || 0;

  // Determine effort level (time commitment)
  let effort = "medium";
  if (runtime < 100) effort = "low";
  if (runtime > 140) effort = "high";
  if (runtime > 180) effort = "marathon";

  // Determine payoff (emotional outcome)
  let payoff = "neutral";
  const primaryGenre = genres[0];

  const genrePayoffMap = {
    "Comedy": "comfort",
    "Family": "comfort",
    "Animation": "comfort",
    "Action": "thrill",
    "Thriller": "thrill",
    "Horror": "thrill",
    "Drama": "inspiration",
    "Romance": "emotional",
    "Adventure": "adventure",
  };

  payoff = genrePayoffMap[primaryGenre] || "neutral";

  // Fallback using ratings
  if (payoff === "neutral") {
    if (voteAverage >= 8) payoff = "comfort";
    else if (voteAverage >= 7) payoff = "neutral";
    else if (voteAverage >= 6) payoff = "comfort";
  }

  // Energy level after watching
  const energyAfterMap = {
    "comfort": "calm",
    "thrill": "hyped",
    "inspiration": "thoughtful",
    "emotional": "reflective",
    "adventure": "energized",
    "neutral": "neutral",
  };

  // Quality indicator
  const quality = voteCount > 1000 && voteAverage >= 7 ? "high" :
                 voteCount > 500 && voteAverage >= 6.5 ? "medium" :
                 "standard";

  return {
    effort,
    payoff,
    energy_after: energyAfterMap[payoff],
    quality,
    genreProfile: genres,
    volatility: calculateVolatility(voteAverage, voteCount),
  };
}

/**
 * Calculate rating volatility (how sure we are about the rating)
 */
function calculateVolatility(voteAverage, voteCount) {
  if (voteCount < 100) return "high"; // Unreliable
  if (voteCount < 500) return "medium";
  return "low"; // Very reliable
}

/**
 * Hybrid scoring system combining multiple factors
 */
export function scoreMovie(
  intent,
  outcome,
  movie,
  userProfile = {},
  trendingMetrics = {}
) {
  let score = 0;
  const weights = {
    prediction: 0.25,
    intent_alignment: 0.20,
    trending: 0.15,
    user_affinity: 0.20,
    quality: 0.15,
    seasonality: 0.05,
  };

  // 1. PREDICTION SCORE: Rating + Popularity + Vote confidence
  const ratingScore = (movie.vote_average || 0) / 10;
  const popularityScore = Math.min((movie.popularity || 0) / 1000, 1);
  const voteConfidenceScore = Math.min((movie.vote_count || 0) / 5000, 1);
  const ratingReliability = outcome.volatility === "low" ? 1.0 :
                           outcome.volatility === "medium" ? 0.8 : 0.6;

  const predictionScore =
    (ratingScore * 0.4 + popularityScore * 0.35 + voteConfidenceScore * 0.25) *
    ratingReliability;

  score += predictionScore * weights.prediction;

  // 2. INTENT ALIGNMENT
  let intentAlignment = 0;
  
  // Goal/Payoff matching
  if (intent.goal && outcome.payoff) {
    if (intent.goal === "relax" && (outcome.payoff === "comfort" || outcome.payoff === "emotional")) intentAlignment += 0.3;
    else if (intent.goal === "thrill" && (outcome.payoff === "thrill" || outcome.payoff === "adventure")) intentAlignment += 0.3;
    else if (intent.goal === "inspire" && (outcome.payoff === "inspiration" || outcome.payoff === "emotional")) intentAlignment += 0.3;
    else intentAlignment += 0.1; // Partial match
  } else {
    intentAlignment += 0.15; // No goal specified, give default boost
  }

  // Energy/Effort matching
  if (intent.attention || intent.energy) {
    // attention: short/normal/deep
    // energy: low/medium/high
    if (intent.attention === "short" && outcome.effort === "low") intentAlignment += 0.25;
    else if (intent.attention === "normal" && outcome.effort === "medium") intentAlignment += 0.25;
    else if (intent.attention === "deep" && (outcome.effort === "high" || outcome.effort === "marathon")) intentAlignment += 0.25;
    else intentAlignment += 0.1;
  } else {
    intentAlignment += 0.15;
  }

  // Quality bonus
  if (outcome.quality === "high") intentAlignment += 0.1;

  score += Math.min(intentAlignment, 1.0) * weights.intent_alignment;

  // 3. TRENDING FACTOR (recency boost)
  const trendingBoost = getTrendingScore(movie.popularity, trendingMetrics);
  score += trendingBoost * weights.trending;

  // 4. USER AFFINITY (learned preferences)
  const userAffinity = calculateUserAffinity(movie, outcome, userProfile);
  score += userAffinity * weights.user_affinity;

  // 5. QUALITY CONFIDENCE
  const qualityScore =
    outcome.quality === "high" ? 1.0 :
    outcome.quality === "medium" ? 0.7 : 0.5;
  score += qualityScore * weights.quality;

  // 6. SEASONALITY (what season is it, what do people watch?)
  const seasonalBoost = getSeasonalFactor(movie.genre_ids);
  score += seasonalBoost * weights.seasonality;

  // FRESHNESS PENALTY (oversaturation penalty)
  if (movie.popularity > 800) score *= 0.95;

  return Math.min(Math.max(score, 0), 1);
}

/**
 * Calculate how well a movie matches user's learned preferences
 */
function calculateUserAffinity(movie, outcome, userProfile = {}) {
  let score = 0;

  if (!userProfile.preferredGenres || userProfile.preferredGenres.length === 0) {
    return 0.5; // Neutral for cold-start
  }

  // Genre overlap
  const movieGenres = movie.genre_ids || [];
  const matchedGenres = movieGenres.filter(g => userProfile.preferredGenres.includes(g));
  const genreScore = matchedGenres.length / Math.max(movieGenres.length, userProfile.preferredGenres.length);
  score += genreScore * 0.4;

  // Rating preference alignment
  if (userProfile.avgRatingWatched) {
    const ratingDiff = Math.abs(movie.vote_average - userProfile.avgRatingWatched);
    const ratingScore = Math.max(0, 1 - (ratingDiff / 3));
    score += ratingScore * 0.3;
  }

  // Runtime preference
  if (userProfile.avgRuntimeWatched) {
    const runtimeDiff = Math.abs((movie.runtime || 120) - userProfile.avgRuntimeWatched);
    const runtimeScore = Math.max(0, 1 - (runtimeDiff / 100));
    score += runtimeScore * 0.3;
  }

  return Math.min(score, 1);
}

/**
 * Generate contextual, persuasive explanations
 */
export function generateExplanation(outcome, movie, userProfile = {}, context = {}) {
  const explanations = [];

  // Quality-based explanation
  if (outcome.quality === "high" && movie.vote_average >= 7.5) {
    explanations.push(`⭐ Highly rated (${movie.vote_average.toFixed(1)}/10) with ${(movie.vote_count || 0).toLocaleString()} reviews`);
  }

  // Payoff-based explanation
  const payoffExplanations = {
    "comfort": "Perfect for relaxing without stress",
    "thrill": "Fast-paced and keeps you on edge",
    "inspiration": "Emotionally powerful and thought-provoking",
    "emotional": "Deep emotional journey",
    "adventure": "Thrilling and immersive adventure",
  };
  if (payoffExplanations[outcome.payoff]) {
    explanations.push(payoffExplanations[outcome.payoff]);
  }

  // Effort-based explanation
  if (outcome.effort === "low") {
    explanations.push(`Light watch (${movie.runtime || 120} mins)`);
  } else if (outcome.effort === "high") {
    explanations.push(`Epic experience (${movie.runtime || 120} mins)`);
  }

  // Trending explanation
  if (movie.popularity > 700) {
    explanations.push("🔥 Currently trending");
  }

  // Personalization explanation
  if (userProfile.preferredGenres && userProfile.preferredGenres.length > 0) {
    const mainGenre = movie.genre_ids?.[0];
    if (mainGenre && userProfile.preferredGenres.includes(mainGenre)) {
      explanations.push("Matches your taste");
    }
  }

  // Seasonal/timing explanation
  if (context.isWeekend) {
    explanations.push("Great for weekend viewing");
  }

  return explanations.join(" • ");
}

/**
 * Diversity-aware ranking (avoid recommending similar movies in succession)
 */
export function rankWithDiversity(movies, previousRecommendations = [], diversityWeight = 0.1) {
  return movies.map(movie => {
    let adjustedScore = movie.score;

    // Penalize similarity to recent recommendations
    previousRecommendations.forEach(prevMovie => {
      const similarity = calculateSimilarityScore(movie, prevMovie);
      adjustedScore -= similarity * diversityWeight;
    });

    return { ...movie, adjustedScore: Math.max(0, adjustedScore) };
  });
}

/**
 * Cold-start recommendations for new users
 */
export function generateColdStartRecommendation(movies, intent) {
  // For new users: rely heavily on ratings and explicit intent matching
  const weighted = movies.map(movie => {
    const outcome = predictOutcome(movie);
    const base = (movie.vote_average / 10) * 0.6;
    const match = (intent.goal === outcome.payoff ? 0.4 : 0.1);
    return {
      ...movie,
      coldStartScore: base + match,
    };
  });

  return weighted.sort((a, b) => b.coldStartScore - a.coldStartScore)[0];
}

/**
 * A/B testing support: select recommendation model variant
 */
export function selectRecommendationVariant(userId, ratio = { variantA: 0.5, variantB: 0.5 }) {
  const hash = userId.charCodeAt(0) % 100;
  const threshold = ratio.variantA * 100;
  return hash < threshold ? "variantA" : "variantB";
}

/**
 * Calculate expected engagement based on user history
 */
export function predictEngagement(movie, userProfile = {}) {
  if (!userProfile.watchHistory || userProfile.watchHistory.length === 0) {
    return { engagementLikelihood: 0.5, completionRate: 0.6 };
  }

  const avgEngagement = userProfile.watchHistory.reduce((sum, watch) => sum + (watch.engagement || 0.7), 0) /
    userProfile.watchHistory.length;

  const movieSimilarityToHistory = calculateSimilarityScore(
    movie,
    userProfile.watchHistory[userProfile.watchHistory.length - 1]
  );

  const engagementLikelihood = (avgEngagement * 0.6 + movieSimilarityToHistory * 0.4);
  const completionRate = Math.min(engagementLikelihood + 0.2, 1);

  return {
    engagementLikelihood: Math.round(engagementLikelihood * 100),
    completionRate: Math.round(completionRate * 100),
  };
}

export {
  calculateUserAffinity,
  calculateVolatility,
  MIN_RECOMMENDATION_SCORE,
};
