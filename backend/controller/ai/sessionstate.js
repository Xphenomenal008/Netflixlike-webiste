/**
 * Enhanced Session State Management
 * Tracks user session data for maintaining context across recommendations
 */

import { UserPreferenceLearner } from "./userPreferenceLearner.js";

export class SessionState {
  constructor(userId, userProfile = {}) {
    this.userId = userId;
    this.sessionStartTime = Date.now();
    this.userProfile = userProfile;
    this.rejectedPayoffs = [];
    this.acceptedRecommendations = [];
    this.rejectedRecommendations = [];
    this.sessionIntents = [];
    this.currentIntent = null;
    this.engagementMetrics = {
      recsShown: 0,
      recsAccepted: 0,
      recsRejected: 0,
      avgTimePerRec: 0,
    };
    this.feedbackData = [];
    this.diversityTracker = [];
    this.explorationLevel = 0.5; // Balance between exploration and exploitation
  }

  /**
   * Record user intent
   */
  recordIntent(intent) {
    this.currentIntent = {
      ...intent,
      timestamp: Date.now(),
    };
    this.sessionIntents.push(this.currentIntent);
  }

  /**
   * Track when user accepts a recommendation
   */
  recordAcceptance(movie, confidence = null) {
    this.acceptedRecommendations.push({
      movieId: movie.id,
      title: movie.title,
      score: movie.score,
      timestamp: Date.now(),
      confidence,
      intent: this.currentIntent,
    });

    this.engagementMetrics.recsAccepted += 1;
    this.engagementMetrics.recsShown += 1;
    this.updateEngagementMetrics();

    // Learn from acceptance
    this.diversityTracker.push(movie);
  }

  /**
   * Track when user rejects a recommendation
   */
  recordRejection(movie, reason = null) {
    this.rejectedRecommendations.push({
      movieId: movie.id,
      title: movie.title,
      score: movie.score,
      timestamp: Date.now(),
      reason,
      intent: this.currentIntent,
    });

    this.engagementMetrics.recsRejected += 1;
    this.engagementMetrics.recsShown += 1;

    // Track rejected payoffs
    if (movie.outcome?.payoff) {
      if (!this.rejectedPayoffs.includes(movie.outcome.payoff)) {
        this.rejectedPayoffs.push(movie.outcome.payoff);
      }
    }

    this.updateEngagementMetrics();
  }

  /**
   * Record explicit feedback from user
   */
  recordFeedback(movieId, rating, completion = null) {
    this.feedbackData.push({
      movieId,
      rating, // 1-5 stars
      completion, // percentage watched
      timestamp: Date.now(),
    });
  }

  /**
   * Update engagement metrics
   */
  updateEngagementMetrics() {
    const total = this.engagementMetrics.recsShown;
    if (total > 0) {
      this.engagementMetrics.acceptanceRate =
        (this.engagementMetrics.recsAccepted / total * 100).toFixed(2) + "%";
      this.engagementMetrics.rejectionRate =
        (this.engagementMetrics.recsRejected / total * 100).toFixed(2) + "%";
    }
  }

  /**
   * Suggest next exploration level based on session history
   */
  getExplorationLevel() {
    const acceptanceRate = this.engagementMetrics.recsAccepted / Math.max(this.engagementMetrics.recsShown, 1);

    // If user is accepting many recommendations, maintain current approach
    if (acceptanceRate > 0.7) {
      return Math.min(this.explorationLevel + 0.1, 1);
    }

    // If user is rejecting many, explore more
    if (acceptanceRate < 0.3) {
      return Math.min(this.explorationLevel + 0.2, 1);
    }

    return this.explorationLevel;
  }

  /**
   * Get session summary for logging
   */
  getSessionSummary() {
    return {
      userId: this.userId,
      duration: Math.round((Date.now() - this.sessionStartTime) / 1000),
      metrics: this.engagementMetrics,
      acceptedCount: this.acceptedRecommendations.length,
      rejectedCount: this.rejectedRecommendations.length,
      feedbackProvided: this.feedbackData.length,
      rejectedPayoffs: this.rejectedPayoffs,
      intentsCount: this.sessionIntents.length,
    };
  }

  /**
   * Check if session has been idle (no activity)
   */
  isIdle(timeoutMs = 1800000) { // 30 minutes default
    const lastActivity = Math.max(
      ...this.acceptedRecommendations.map((r) => r.timestamp),
      ...this.rejectedRecommendations.map((r) => r.timestamp),
      this.sessionStartTime
    );
    return Date.now() - lastActivity > timeoutMs;
  }

  /**
   * Apply session learning to user profile
   */
  applySessionLearning(userProfile) {
    if (this.feedbackData.length === 0) return userProfile;

    // Update preferred genres based on accepted recommendations
    const genreBoosts = {};
    this.acceptedRecommendations.forEach((rec) => {
      if (rec.intent?.goal) {
        // Boost genres that led to accepted recommendations
      }
    });

    return userProfile;
  }
}

/**
 * Session manager for handling multiple user sessions
 */
export class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  createSession(userId, userProfile) {
    const session = new SessionState(userId, userProfile);
    this.sessions.set(userId, session);
    return session;
  }

  getSession(userId) {
    return this.sessions.get(userId);
  }

  hasSession(userId) {
    return this.sessions.has(userId);
  }

  endSession(userId) {
    const session = this.sessions.get(userId);
    const summary = session?.getSessionSummary();
    this.sessions.delete(userId);
    return summary;
  }

  getAllActiveSessions() {
    return Array.from(this.sessions.values());
  }

  cleanupIdleSessions(timeoutMs = 1800000) {
    const idleSessions = [];
    this.sessions.forEach((session, userId) => {
      if (session.isIdle(timeoutMs)) {
        idleSessions.push(userId);
      }
    });

    idleSessions.forEach((userId) => {
      this.sessions.delete(userId);
    });

    return idleSessions;
  }
}

/**
 * Default session creation
 */
export default function createSession(userId = null, userProfile = {}) {
  return new SessionState(userId, userProfile);
}

