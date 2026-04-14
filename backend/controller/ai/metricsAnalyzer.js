/**
 * Metrics & Analytics for Recommendation System
 * Tracks performance, quality, and business metrics
 */

export class RecommendationMetrics {
  constructor() {
    this.metrics = {
      totalRecommendations: 0,
      acceptedRecommendations: 0,
      rejectedRecommendations: 0,
      averageScore: 0,
      averageEngagement: 0,
      coldStartCount: 0,
      variantAPerformance: { shown: 0, accepted: 0 },
      variantBPerformance: { shown: 0, accepted: 0 },
      averageResponseTime: 0,
      scoreDistribution: {},
      payoffDistribution: {},
      userEngagementLevels: {},
    };
  }

  /**
   * Log recommendation result
   */
  logRecommendation(recommendation, accepted, responseTime, variant = "variantA") {
    this.metrics.totalRecommendations++;
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime * (this.metrics.totalRecommendations - 1) + responseTime) /
      this.metrics.totalRecommendations;

    if (accepted) {
      this.metrics.acceptedRecommendations++;
      this.metrics[`${variant}Performance`].accepted++;
    } else {
      this.metrics.rejectedRecommendations++;
    }

    this.metrics[`${variant}Performance`].shown++;

    // Track score distribution
    const scoreBucket = Math.floor(recommendation.score * 10) / 10;
    this.metrics.scoreDistribution[scoreBucket] =
      (this.metrics.scoreDistribution[scoreBucket] || 0) + 1;

    // Track payoff distribution
    const payoff = recommendation.outcome?.payoff || "neutral";
    this.metrics.payoffDistribution[payoff] = (this.metrics.payoffDistribution[payoff] || 0) + 1;

    // Update average engagement
    const engagement = recommendation.engagement?.engagementLikelihood || 50;
    this.metrics.averageEngagement =
      (this.metrics.averageEngagement * (this.metrics.totalRecommendations - 1) + engagement) /
      this.metrics.totalRecommendations;
  }

  /**
   * Log cold-start recommendation
   */
  logColdStart() {
    this.metrics.coldStartCount++;
  }

  /**
   * Get acceptance rate percentage
   */
  getAcceptanceRate() {
    if (this.metrics.totalRecommendations === 0) return 0;
    return ((this.metrics.acceptedRecommendations / this.metrics.totalRecommendations) * 100).toFixed(2);
  }

  /**
   * Get rejection rate percentage
   */
  getRejectionRate() {
    return (100 - parseFloat(this.getAcceptanceRate())).toFixed(2);
  }

  /**
   * Get variant performance comparison
   */
  getVariantComparison() {
    const variantARate =
      (this.metrics.variantAPerformance.accepted / Math.max(this.metrics.variantAPerformance.shown, 1)) * 100;
    const variantBRate =
      (this.metrics.variantBPerformance.accepted / Math.max(this.metrics.variantBPerformance.shown, 1)) * 100;

    return {
      variantA: {
        acceptanceRate: variantARate.toFixed(2) + "%",
        shown: this.metrics.variantAPerformance.shown,
        accepted: this.metrics.variantAPerformance.accepted,
      },
      variantB: {
        acceptanceRate: variantBRate.toFixed(2) + "%",
        shown: this.metrics.variantBPerformance.shown,
        accepted: this.metrics.variantBPerformance.accepted,
      },
      winner: variantARate > variantBRate ? "variantA" : variantBRate > variantARate ? "variantB" : "tie",
    };
  }

  /**
   * Get full metrics dashboard
   */
  getDashboard() {
    return {
      summary: {
        totalRecommendations: this.metrics.totalRecommendations,
        acceptedRecommendations: this.metrics.acceptedRecommendations,
        rejectedRecommendations: this.metrics.rejectedRecommendations,
        acceptanceRate: this.getAcceptanceRate() + "%",
        rejectionRate: this.getRejectionRate() + "%",
        averageScore: (this.metrics.averageScore / this.metrics.totalRecommendations).toFixed(3),
        averageEngagement: this.metrics.averageEngagement.toFixed(2),
        averageResponseTime: this.metrics.averageResponseTime.toFixed(2) + "ms",
        coldStartRecommendations: this.metrics.coldStartCount,
      },
      distributions: {
        scoreDistribution: this.metrics.scoreDistribution,
        payoffDistribution: this.metrics.payoffDistribution,
      },
      variants: this.getVariantComparison(),
    };
  }

  /**
   * Reset metrics
   */
  reset() {
    this.metrics = {
      totalRecommendations: 0,
      acceptedRecommendations: 0,
      rejectedRecommendations: 0,
      averageScore: 0,
      averageEngagement: 0,
      coldStartCount: 0,
      variantAPerformance: { shown: 0, accepted: 0 },
      variantBPerformance: { shown: 0, accepted: 0 },
      averageResponseTime: 0,
      scoreDistribution: {},
      payoffDistribution: {},
      userEngagementLevels: {},
    };
  }
}

/**
 * Quality Metrics - How good are recommendations?
 */
export class QualityMetrics {
  /**
   * Calculate Normalized Discounted Cumulative Gain (NDCG)
   * Standard metric for ranking quality in recommendations
   */
  static calculateNDCG(recommendedRanking, idealRanking, k = 5) {
    const dcg = this.calculateDCG(recommendedRanking.slice(0, k));
    const idcg = this.calculateDCG(idealRanking.slice(0, k));
    return idcg === 0 ? 0 : dcg / idcg;
  }

  /**
   * Calculate Discounted Cumulative Gain
   */
  static calculateDCG(ranking) {
    let dcg = 0;
    ranking.forEach((score, index) => {
      dcg += (2 ** score - 1) / Math.log2(index + 2);
    });
    return dcg;
  }

  /**
   * Calculate diversity score (0-1, higher is better)
   */
  static calculateDiversityScore(recommendations) {
    if (recommendations.length < 2) return 1.0;

    let totalDissimilarity = 0;
    let pairCount = 0;

    for (let i = 0; i < recommendations.length; i++) {
      for (let j = i + 1; j < recommendations.length; j++) {
        // Calculate genre diversity
        const genresA = new Set(recommendations[i].genre_ids || []);
        const genresB = new Set(recommendations[j].genre_ids || []);
        const intersection = new Set([...genresA].filter(x => genresB.has(x)));
        const union = new Set([...genresA, ...genresB]);
        const jaccard = union.size > 0 ? 1 - intersection.size / union.size : 1;

        totalDissimilarity += jaccard;
        pairCount++;
      }
    }

    return pairCount > 0 ? totalDissimilarity / pairCount : 1.0;
  }

  /**
   * Calculate precision@k
   * What fraction of top k recommendations were relevant?
   */
  static calculatePrecisionAtK(recommendations, actuallyWatched, k = 5) {
    const watchedSet = new Set(actuallyWatched.map(m => m.id));
    const topK = recommendations.slice(0, k);
    const relevant = topK.filter(m => watchedSet.has(m.id)).length;
    return (relevant / k).toFixed(2);
  }

  /**
   * Calculate recall@k
   * What fraction of all relevant items are in top k?
   */
  static calculateRecallAtK(recommendations, actuallyWatched, k = 5) {
    if (actuallyWatched.length === 0) return 1.0;
    const watchedSet = new Set(actuallyWatched.map(m => m.id));
    const topK = recommendations.slice(0, k);
    const relevant = topK.filter(m => watchedSet.has(m.id)).length;
    return (relevant / actuallyWatched.length).toFixed(2);
  }

  /**
   * Calculate F1 Score (harmonic mean of precision and recall)
   */
  static calculateF1Score(precision, recall) {
    if (precision + recall === 0) return 0;
    return (2 * (precision * recall) / (precision + recall)).toFixed(2);
  }
}

/**
 * Global metrics singleton
 */
export const globalMetrics = new RecommendationMetrics();

export default {
  RecommendationMetrics,
  QualityMetrics,
  globalMetrics,
};
