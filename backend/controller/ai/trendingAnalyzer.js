/**
 * Trending and seasonal analysis for recommendations
 */

const CURRENT_DATE = new Date();
const CURRENT_MONTH = CURRENT_DATE.getMonth();

/**
 * Get trending score based on popularity and velocity
 */
export function getTrendingScore(popularity, trendingMetrics = {}) {
  if (!popularity) return 0;

  // Normalize popularity (0-1 scale)
  let trendScore = Math.min(popularity / 1000, 1);

  // Apply momentum if available (how fast is it trending up?)
  if (trendingMetrics.growthRate) {
    const growthBoost = Math.min(trendingMetrics.growthRate * 0.3, 0.3);
    trendScore += growthBoost;
  }

  // Recent movies get a slight boost
  if (trendingMetrics.releaseDateDaysAgo !== undefined) {
    if (trendingMetrics.releaseDateDaysAgo < 30) {
      trendScore += 0.15; // New release boost
    } else if (trendingMetrics.releaseDateDaysAgo < 90) {
      trendScore += 0.05; // Recent boost
    }
  }

  return Math.min(trendScore, 1);
}

/**
 * Get seasonal viewing preferences
 */
export function getSeasonalFactor(genreIds = []) {
  const season = getSeason();
  const seasonalPreferences = SEASONAL_VIEWING_PATTERNS[season];

  if (!genreIds || genreIds.length === 0) return 0;

  // Check if movie genres match seasonal preferences
  const matchCount = genreIds.filter(id => seasonalPreferences.includes(id)).length;
  return Math.min(matchCount / genreIds.length * 0.5, 0.5); // Max 0.5 boost
}

/**
 * Determine current season
 */
export function getSeason() {
  const month = CURRENT_MONTH;
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter"; // November, December, January
}

/**
 * Seasonal viewing patterns
 */
export const SEASONAL_VIEWING_PATTERNS = {
  winter: [
    10751, // Family
    35,    // Comedy
    16,    // Animation
    10749, // Romance (holiday romance)
    27,    // Horror (dark winter)
  ],
  spring: [
    12,    // Adventure
    878,   // Science Fiction
    28,    // Action
    10749, // Romance
  ],
  summer: [
    28,    // Action
    12,    // Adventure
    35,    // Comedy
    10751, // Family (school break)
    16,    // Animation
  ],
  fall: [
    18,    // Drama
    53,    // Thriller
    27,    // Horror (Halloween)
    9648,  // Mystery
  ],
};

/**
 * Calculate day-of-week viewing patterns
 */
export function getDayOfWeekFactor() {
  const dayOfWeek = CURRENT_DATE.getDay();
  // 0 = Sunday, 6 = Saturday

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 1.1; // Weekend boost
  }

  // Weekday evening (7-11pm)
  const hour = CURRENT_DATE.getHours();
  if (hour >= 19 && hour <= 23) {
    return 1.05; // Evening boost
  }

  return 1.0;
}

/**
 * Get time-of-day recommendations
 */
export function getTimeOfDayPreference() {
  const hour = CURRENT_DATE.getHours();

  if (hour >= 22 || hour < 6) return "late-night"; // Lighter content
  if (hour >= 6 && hour < 12) return "morning"; // Casual viewing
  if (hour >= 12 && hour < 17) return "afternoon"; // Varied
  if (hour >= 17 && hour < 21) return "evening"; // Family/light
  return "prime-time"; // 9pm-11pm: any content
}

/**
 * Trending velocity calculation (how fast is something gaining popularity?)
 */
export function calculateTrendingVelocity(dailyPopularities = []) {
  if (dailyPopularities.length < 2) return 0;

  const recent = dailyPopularities.slice(-7);
  const older = dailyPopularities.slice(-14, -7);

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

  return (recentAvg - olderAvg) / (olderAvg || 1);
}

/**
 * Check if movie is in declining trend
 */
export function isDeclined(trendingMetrics = {}) {
  return trendingMetrics.velocity < -0.05;
}

/**
 * Check if movie is surging
 */
export function isSurging(trendingMetrics = {}) {
  return trendingMetrics.velocity > 0.15;
}

/**
 * Get recommendation urgency (how soon should we recommend this?)
 */
export function getRecommendationUrgency(popularity, releaseDateDaysAgo) {
  let urgency = 0.5; // Default

  // Surging content should be recommended soon
  if (popularity > 800) urgency += 0.3;

  // Declining content should be recommended before it's forgotten
  if (popularity < 100) urgency -= 0.2;

  // Newly released should be prioritized
  if (releaseDateDaysAgo < 14) urgency += 0.2;
  if (releaseDateDaysAgo < 7) urgency += 0.2;

  return Math.min(Math.max(urgency, 0), 1);
}

/**
 * Birthday/Anniversary boost (if available)
 */
export function getSpecialEventBoost(userProfile = {}) {
  if (!userProfile.birthday) return 0;

  const today = new Date();
  const birthday = new Date(userProfile.birthday);

  // Check if birthday is within 7 days
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const birthdayDay = Math.floor((birthday - new Date(birthday.getFullYear(), 0, 0)) / 86400000);

  const diff = Math.abs(dayOfYear - birthdayDay);
  if (diff <= 7) {
    return 0.1; // Special boost on birthday week
  }

  return 0;
}
