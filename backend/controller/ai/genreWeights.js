/**
 * Genre mapping and dynamic weight system
 */

export const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const GENRE_POPULARITY_BASELINE = {
  28: 750,    // Action
  12: 650,    // Adventure
  35: 600,    // Comedy
  18: 500,    // Drama
  53: 700,    // Thriller
  10749: 550, // Romance
  16: 650,    // Animation
  27: 600,    // Horror
};

export const GENRE_RATING_BASELINE = {
  28: 6.8,    // Action
  12: 7.2,    // Adventure
  35: 6.9,    // Comedy
  18: 7.5,    // Drama
  53: 7.1,    // Thriller
  10749: 7.0, // Romance
  16: 7.4,    // Animation
  27: 6.5,    // Horror
};

/**
 * Factor in genre affinity based on user preferences
 */
export function getGenreWeights(userPreferences = {}) {
  const weights = {};

  Object.entries(GENRE_MAP).forEach(([id, name]) => {
    weights[id] = 1.0; // Base weight

    // Boost if user likes this genre
    if (userPreferences.likedGenres?.includes(id)) {
      weights[id] += 0.3;
    }

    // Reduce if user dislikes
    if (userPreferences.dislikedGenres?.includes(id)) {
      weights[id] -= 0.3;
    }

    // Normalize
    weights[id] = Math.max(0.3, weights[id]);
  });

  return weights;
}

/**
 * Get the genre map
 */
export function getGenreMap() {
  return GENRE_MAP;
}

/**
 * Calculate multi-genre affinity score
 */
export function calculateGenreAffinity(genreIds, userProfile = {}) {
  if (!genreIds || genreIds.length === 0) return 0.5;
  if (!userProfile.preferredGenres || userProfile.preferredGenres.length === 0) return 0.5;

  const matches = genreIds.filter(g => userProfile.preferredGenres.includes(g));
  return Math.min(matches.length / genreIds.length, 1);
}

/**
 * Map genre IDs to human-readable genres
 */
export function mapGenreIds(genreIds) {
  return genreIds.map(id => GENRE_MAP[id]).filter(Boolean);
}
