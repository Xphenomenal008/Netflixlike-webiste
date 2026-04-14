import express from "express";
const router = express.Router();

import ai_summery from "../controller/ai_controller.js";
import { FetchfromTMDB } from "../services/tmdb.service.js";

import {
  predictOutcome,
  scoreMovie,
  generateExplanation,
  rankWithDiversity,
  generateColdStartRecommendation,
  selectRecommendationVariant,
  predictEngagement,
  MIN_RECOMMENDATION_SCORE,
} from "../controller/ai/decisionEngine.js";

import { SessionManager } from "../controller/ai/sessionstate.js";
import { UserPreferenceLearner } from "../controller/ai/userPreferenceLearner.js";
import { generalCache, userPreferenceCache, trendingCache } from "../controller/ai/cachingManager.js";
import { getDayOfWeekFactor, getTimeOfDayPreference, isSurging } from "../controller/ai/trendingAnalyzer.js";

const sessionManager = new SessionManager();

/**
 * Advanced recommendation endpoint with production-level features
 */
router.post("/", async (req, res) => {
  try {
    const intent = req.body;
    const userId = req.user?._id || "anonymous-" + Date.now();

    console.log(`[RECOMMENDATION] User: ${userId}, Intent:`, intent);

    // Get or create user session
    let session = sessionManager.getSession(userId);
    if (!session) {
      const userProfile = userPreferenceCache.get(userId) || UserPreferenceLearner.getDefaultProfile();
      session = sessionManager.createSession(userId, userProfile);
    }

    // Record the intent
    session.recordIntent(intent);

    // Construct cache key
    const cacheKey = generalCache.constructor.generateKey("recommendation", intent.goal, intent.energy);
    let moviesData = generalCache.get(cacheKey);

    if (!moviesData) {
      // Fetch trending movies
      const TMDB_URL = "https://api.themoviedb.org/3/trending/movie/week";
      const tmdbResponse = await FetchfromTMDB(TMDB_URL);
      moviesData = tmdbResponse.results || [];

      // Cache for 10 minutes
      generalCache.set(cacheKey, moviesData, 600000);
    }

    if (moviesData.length === 0) {
      return res.status(404).json({ error: "No movies available", needMoreInfo: true });
    }

    // Get tending metrics
    const trendingMetrics = {
      growthRate: 0.1,
      releaseDateDaysAgo: 0,
    };

    // Enhanced scoring with all factors
    const processed = moviesData.map((movie) => {
      const outcome = predictOutcome(movie, session.userProfile);
      const score = scoreMovie(intent, outcome, movie, session.userProfile, trendingMetrics);
      const engagement = predictEngagement(movie, session.userProfile);

      return {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        popularity: movie.popularity,
        overview: movie.overview,
        release_date: movie.release_date,
        genre_ids: movie.genre_ids,
        score,
        outcome,
        explanation: generateExplanation(outcome, movie, session.userProfile, {
          isWeekend: getDayOfWeekFactor() > 1,
        }),
        engagement,
        confidence: (score * 100).toFixed(1) + "%",
      };
    });

    // Apply diversity ranking
    const diverseMovies = rankWithDiversity(processed, session.acceptedRecommendations, 0.15);

    // Sort by adjusted score
    diverseMovies.sort((a, b) => b.adjustedScore - a.adjustedScore);

    // Get top candidates
    const topCandidates = diverseMovies.slice(0, Math.max(3, Math.ceil(moviesData.length * 0.2)));

    // Cold-start handling for new users - ALWAYS return a recommendation
    let bestRecommendation;
    if (session.userProfile.isColdStart || session.engagementMetrics.recsShown === 0) {
      bestRecommendation = generateColdStartRecommendation(processed, intent);
    } else {
      // Smart selection: prefer diversity if user has history, exploration if they're rejecting
      const explorationBoost = session.getExplorationLevel();
      bestRecommendation = topCandidates[0] || processed[0]; // Always ensure we have a recommendation
    }

    // A/B testing: select variant
    const variant = selectRecommendationVariant(userId, { variantA: 0.6, variantB: 0.4 });

    // Ensure we always return a recommendation (even if below threshold)
    if (!bestRecommendation) {
      bestRecommendation = processed.sort((a, b) => (b.score || 0) - (a.score || 0))[0];
    }

    // Log recommendation details
    console.log(`[RECOMMENDATION_SUCCESS] Score: ${(bestRecommendation.score * 100).toFixed(2)}%, Variant: ${variant}`);

    // Response with rich metadata - ALWAYS return a valid recommendation
    res.json({
      recommendation: {
        ...bestRecommendation,
        variant,
        session: {
          acceptanceHistory: session.engagementMetrics.recsAccepted,
          sessionDuration: Math.round((Date.now() - session.sessionStartTime) / 1000),
        },
      },
      alternativeRecommendations: topCandidates.slice(1, 4), // Top 3 alternatives
      metadata: {
        timeOfDay: getTimeOfDayPreference(),
        cacheHitRate: generalCache.getStats().hitRate,
        modelVersion: "v2.0-production",
      },
    });
  } catch (err) {
    console.error("[ERROR] Recommendation failed:", err);
    res.status(500).json({
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Record user feedback on recommendation
 */
router.post("/feedback", async (req, res) => {
  try {
    const { accepted, movieId, reason, rating } = req.body;
    const userId = req.user?._id || "anonymous";

    const session = sessionManager.getSession(userId);
    if (!session) {
      return res.status(400).json({ error: "No active session" });
    }

    if (accepted) {
      session.recordAcceptance({ id: movieId });
    } else {
      session.recordRejection({ id: movieId }, reason);
    }

    if (rating) {
      session.recordFeedback(movieId, rating);
    }

    res.json({
      success: true,
      sessionMetrics: session.engagementMetrics,
    });
  } catch (err) {
    console.error("[ERROR] Feedback recording failed:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get personalized recommendations based on user history
 */
router.get("/personalized", async (req, res) => {
  try {
    const userId = req.user?._id || "anonymous";
    const limit = parseInt(req.query.limit) || 5;

    let userProfile = userPreferenceCache.get(userId);
    if (!userProfile) {
      // Would need to fetch from DB
      userProfile = UserPreferenceLearner.getDefaultProfile();
    }

    const moodAffinity = UserPreferenceLearner.calculateMoodAffinity(userProfile);

    res.json({
      profile: {
        preferredGenres: userProfile.preferredGenres,
        engagementLevel: userProfile.engagementLevel,
        moodPreferences: moodAffinity,
        totalWatched: userProfile.totalMoviesWatched,
      },
    });
  } catch (err) {
    console.error("[ERROR] Personalization failed:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get session analytics and insights
 */
router.get("/session", async (req, res) => {
  try {
    const userId = req.user?._id || "anonymous";
    const session = sessionManager.getSession(userId);

    if (!session) {
      return res.json({ message: "No active session" });
    }

    res.json({
      summary: session.getSessionSummary(),
      metrics: session.engagementMetrics,
      topAccepted: session.acceptedRecommendations.slice(-5),
    });
  } catch (err) {
    console.error("[ERROR] Session analytics failed:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get cache statistics (for monitoring)
 */
router.get("/cache-stats", async (req, res) => {
  try {
    res.json({
      generalCache: generalCache.getStats(),
      activeSessions: sessionManager.getAllActiveSessions().length,
      cacheSize: generalCache.getStats().size,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * AI-powered summary (existing endpoint)
 */
router.post("/summarize", ai_summery);

export default router;
