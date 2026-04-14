/**
 * Content-based similarity calculations
 * Used for finding similar movies and avoiding duplicates
 */

/**
 * Calculate cosine similarity between two movies
 */
export function calculateSimilarityScore(movie1, movie2) {
  if (!movie1 || !movie2) return 0;

  let similarity = 0;

  // Genre similarity (most important)
  const genres1 = new Set(movie1.genre_ids || []);
  const genres2 = new Set(movie2.genre_ids || []);

  if (genres1.size > 0 && genres2.size > 0) {
    const intersection = new Set([...genres1].filter(x => genres2.has(x)));
    const union = new Set([...genres1, ...genres2]);
    const jaccardSimilarity = intersection.size / union.size;
    similarity += jaccardSimilarity * 0.5;
  }

  // Rating similarity
  const ratingDiff = Math.abs((movie1.vote_average || 0) - (movie2.vote_average || 0));
  const ratingScore = Math.max(0, 1 - (ratingDiff / 10));
  similarity += ratingScore * 0.2;

  // Release date proximity (movies from same era)
  if (movie1.release_date && movie2.release_date) {
    const year1 = new Date(movie1.release_date).getFullYear();
    const year2 = new Date(movie2.release_date).getFullYear();
    const yearDiff = Math.abs(year1 - year2);
    const yearScore = Math.max(0, 1 - (yearDiff / 20));
    similarity += yearScore * 0.15;
  }

  // Popularity range (similar audience size)
  const popularityDiff = Math.abs((movie1.popularity || 0) - (movie2.popularity || 0));
  const popularityScore = Math.max(0, 1 - (popularityDiff / 1000));
  similarity += popularityScore * 0.15;

  return Math.min(similarity, 1);
}

/**
 * Find most similar movies from a list
 */
export function findSimilarMovies(targetMovie, movieList, limit = 5) {
  return movieList
    .map(movie => ({
      ...movie,
      similarity: calculateSimilarityScore(targetMovie, movie),
    }))
    .filter(m => m.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/**
 * Calculate content diversity of a recommendation list
 */
export function calculateDiversity(movies) {
  if (movies.length < 2) return 1.0;

  let totalSimilarity = 0;
  let pairCount = 0;

  for (let i = 0; i < movies.length; i++) {
    for (let j = i + 1; j < movies.length; j++) {
      totalSimilarity += calculateSimilarityScore(movies[i], movies[j]);
      pairCount++;
    }
  }

  const avgSimilarity = totalSimilarity / pairCount;
  return Math.max(0, 1 - avgSimilarity); // Higher diversity = lower similarity
}

/**
 * Ensure recommended list has genre diversity
 */
export function ensureDiverseGenres(movies, targetDiversity = 0.7) {
  const selected = [];
  const genreCountMap = {};

  // Sort by score
  const sorted = [...movies].sort((a, b) => b.score - a.score);

  for (const movie of sorted) {
    const mainGenre = movie.genre_ids?.[0];
    const genreCount = genreCountMap[mainGenre] || 0;

    // Allow multiple films of same genre but with diversity
    if (genreCount < 2 || selected.length < Math.ceil(movies.length * 0.5)) {
      selected.push(movie);
      genreCountMap[mainGenre] = genreCount + 1;
    }

    if (selected.length >= movies.length) break;
  }

  return selected;
}

/**
 * Calculate metadata distance (for hybrid filtering)
 */
export function calculateMetadataDistance(movie1, movie2) {
  let distance = 0;

  // Genre distance (0 = same, 1 = completely different)
  const genres1 = new Set(movie1.genre_ids || []);
  const genres2 = new Set(movie2.genre_ids || []);
  const genreIntersection = new Set([...genres1].filter(x => genres2.has(x)));
  const genreUnion = new Set([...genres1, ...genres2]);
  distance += (1 - (genreIntersection.size / (genreUnion.size || 1))) * 0.4;

  // Rating distance
  const ratingDistance = Math.abs((movie1.vote_average || 0) - (movie2.vote_average || 0)) / 10;
  distance += ratingDistance * 0.3;

  // Popularity distance (normalized to 0-1)
  const popularityDistance = Math.abs((movie1.popularity || 0) - (movie2.popularity || 0)) / 1000;
  distance += Math.min(popularityDistance, 1) * 0.3;

  return Math.min(distance, 1);
}
