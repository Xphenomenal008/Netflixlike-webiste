/**
 * User Preference Learning System
 * Builds user profiles based on watch history and interactions
 */

import { calculateGenreAffinity } from "./genreWeights.js";

export class UserPreferenceLearner {
  /**
   * Build or update user profile from watch history
   */
  static buildUserProfile(watchHistory = []) {
    if (!watchHistory || watchHistory.length === 0) {
      return this.getDefaultProfile();
    }

    const profile = {
      preferredGenres: [],
      dislikedGenres: [],
      avgRatingWatched: 0,
      avgRuntimeWatched: 0,
      avgPopularityWatched: 0,
      genreFrequency: {},
      totalWatchTime: 0,
      totalMoviesWatched: watchHistory.length,
      lastWatchDate: null,
      preferredPayoffs: {},
      engagementLevel: "moderate",
      watchHistory: watchHistory,
    };

    // Aggregate data
    let totalRating = 0;
    let totalRuntime = 0;
    let totalPopularity = 0;
    let totalEngagement = 0;

    watchHistory.forEach((watch) => {
      const movie = watch.movie || watch;

      totalRating += movie.vote_average || 0;
      totalRuntime += movie.runtime || 120;
      totalPopularity += movie.popularity || 0;
      totalEngagement += watch.engagement || 0.7;

      if (watch.completed && movie.runtime) {
        profile.totalWatchTime += movie.runtime;
      }

      // Genre frequency
      if (movie.genre_ids) {
        movie.genre_ids.forEach((genreId) => {
          profile.genreFrequency[genreId] = (profile.genreFrequency[genreId] || 0) + 1;
        });
      }

      // Update last watch date
      if (watch.watchedAt) {
        profile.lastWatchDate = new Date(watch.watchedAt);
      }

      // Track payoff preferences
      if (watch.payoff) {
        profile.preferredPayoffs[watch.payoff] = (profile.preferredPayoffs[watch.payoff] || 0) + 1;
      }
    });

    const count = watchHistory.length;
    profile.avgRatingWatched = totalRating / count;
    profile.avgRuntimeWatched = totalRuntime / count;
    profile.avgPopularityWatched = totalPopularity / count;
    profile.engagementLevel = this.determineEngagementLevel(totalEngagement / count);

    // Determine preferred genres (top 3-5)
    const sortedGenres = Object.entries(profile.genreFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => parseInt(id));

    profile.preferredGenres = sortedGenres;

    // Determine disliked genres (bottom 2-3 that were watched but rated low)
    const lowRatedGenres = watchHistory
      .filter((w) => (w.movie?.vote_average || 0) < 5)
      .flatMap((w) => w.movie?.genre_ids || [])
      .reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

    profile.dislikedGenres = Object.entries(lowRatedGenres)
      .filter(([, count]) => count >= 2) // At least 2 dislikes
      .map(([id]) => parseInt(id));

    return profile;
  }

  /**
   * Determine engagement level from average engagement score
   */
  static determineEngagementLevel(avgEngagement) {
    if (avgEngagement < 0.3) return "low";
    if (avgEngagement < 0.6) return "moderate";
    if (avgEngagement < 0.85) return "high";
    return "very-high";
  }

  /**
   * Get default profile for new users
   */
  static getDefaultProfile() {
    return {
      preferredGenres: [],
      dislikedGenres: [],
      avgRatingWatched: 7.0,
      avgRuntimeWatched: 120,
      avgPopularityWatched: 100,
      genreFrequency: {},
      totalWatchTime: 0,
      totalMoviesWatched: 0,
      lastWatchDate: null,
      preferredPayoffs: {},
      engagementLevel: "moderate",
      watchHistory: [],
      isColdStart: true,
    };
  }

  /**
   * Calculate mood affinity based on watch patterns
   */
  static calculateMoodAffinity(userProfile) {
    const moodScores = {
      comfort: 0,
      thrill: 0,
      inspiration: 0,
      emotional: 0,
      adventure: 0,
    };

    const totalWatches = userProfile.totalMoviesWatched;

    if (totalWatches === 0) {
      return moodScores; // Neutral
    }

    Object.entries(userProfile.preferredPayoffs || {}).forEach(([mood, count]) => {
      if (moodScores.hasOwnProperty(mood)) {
        moodScores[mood] = count / totalWatches;
      }
    });

    return moodScores;
  }

  /**
   * Predict if user will complete a movie
   */
  static predictCompletionRate(userProfile, movieRuntime) {
    const avgWatched = userProfile.avgRuntimeWatched || 120;
    const engagementMultiplier =
      {
        "low": 0.4,
        "moderate": 0.7,
        "high": 0.85,
        "very-high": 0.95,
      }[userProfile.engagementLevel] || 0.7;

    const runtimeDiff = Math.abs(movieRuntime - avgWatched);
    const runtimePenalty = Math.max(0, 1 - runtimeDiff / 300);

    return Math.round((runtimePenalty * engagementMultiplier) * 100);
  }

  /**
   * Calculate user similarity for collaborative filtering
   */
  static calculateUserSimilarity(profile1, profile2) {
    if (!profile1 || !profile2) return 0;

    let similarity = 0;

    // Genre preference overlap
    const genres1 = new Set(profile1.preferredGenres || []);
    const genres2 = new Set(profile2.preferredGenres || []);

    if (genres1.size > 0 && genres2.size > 0) {
      const intersection = new Set([...genres1].filter((x) => genres2.has(x)));
      const union = new Set([...genres1, ...genres2]);
      const jaccardSimilarity = intersection.size / union.size;
      similarity += jaccardSimilarity * 0.4;
    }

    // Rating preference similarity
    const ratingDiff = Math.abs(
      (profile1.avgRatingWatched || 7) - (profile2.avgRatingWatched || 7)
    );
    const ratingScore = Math.max(0, 1 - ratingDiff / 5);
    similarity += ratingScore * 0.3;

    // Engagement level
    const engagementMatch = profile1.engagementLevel === profile2.engagementLevel ? 0.2 : 0.05;
    similarity += engagementMatch;

    // Mood preference similarity
    const mood1 = this.calculateMoodAffinity(profile1);
    const mood2 = this.calculateMoodAffinity(profile2);
    let moodDistance = 0;
    Object.keys(mood1).forEach((mood) => {
      moodDistance += Math.abs((mood1[mood] || 0) - (mood2[mood] || 0));
    });
    const moodScore = Math.max(0, 1 - moodDistance / 2);
    similarity += moodScore * 0.1;

    return Math.min(similarity, 1);
  }

  /**
   * Identify trending genres for user (genres they're watching more of lately)
   */
  static identifyTrendingPreferences(watchHistory, windowDays = 30) {
    const recentDate = Date.now() - windowDays * 24 * 60 * 60 * 1000;
    const recent = watchHistory.filter((w) => new Date(w.watchedAt) > recentDate);

    const genreFrequency = {};
    recent.forEach((watch) => {
      (watch.movie?.genre_ids || []).forEach((genreId) => {
        genreFrequency[genreId] = (genreFrequency[genreId] || 0) + 1;
      });
    });

    return Object.entries(genreFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([id]) => parseInt(id));
  }

  /**
   * Detect watching patterns (time of day, frequency, duration)
   */
  static detectWatchingPatterns(watchHistory) {
    const patterns = {
      daysActive: 0,
      avgMoviesPerDay: 0,
      avgWatchTime: 0,
      preferredTimes: {},
      binge: false,
    };

    if (watchHistory.length < 2) return patterns;

    const datesWatched = new Set(
      watchHistory.map((w) => new Date(w.watchedAt).toDateString())
    );
    patterns.daysActive = datesWatched.size;
    patterns.avgMoviesPerDay = (watchHistory.length / datesWatched.size).toFixed(2);
    patterns.avgWatchTime =
      watchHistory.reduce((sum, w) => sum + (w.movie?.runtime || 120), 0) / watchHistory.length;

    // Check for binge watching (3+ movies in one day)
    const dayMovieCount = {};
    watchHistory.forEach((w) => {
      const day = new Date(w.watchedAt).toDateString();
      dayMovieCount[day] = (dayMovieCount[day] || 0) + 1;
    });

    patterns.binge = Object.values(dayMovieCount).some((count) => count >= 3);

    return patterns;
  }

  /**
   * Export user profile for analytics
   */
  static exportProfile(userProfile) {
    return {
      id: userProfile.userId,
      genrePreferences: userProfile.preferredGenres,
      ratingTendency: userProfile.avgRatingWatched,
      engagementLevel: userProfile.engagementLevel,
      totalMoviesWatched: userProfile.totalMoviesWatched,
      watchingPatterns: this.detectWatchingPatterns(userProfile.watchHistory),
      moodPreferences: this.calculateMoodAffinity(userProfile),
    };
  }
}

export default UserPreferenceLearner;
