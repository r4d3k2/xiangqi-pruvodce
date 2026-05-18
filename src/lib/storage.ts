// Persisted practice progress.
// Stored under localStorage key `xiangqi-openings-progress`
// as a record { [variantId]: { stars, mistakes } } — keeps the best run.

export interface VariantProgress {
  stars: number;     // 1..3
  mistakes: number;  // best (lowest) mistake count
}

export type ProgressMap = Record<string, VariantProgress>;

const KEY = "xiangqi-openings-progress";

export function loadProgress(): ProgressMap {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveProgress(map: ProgressMap): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    // ignore quota / serialization errors
  }
}

export function starsFromMistakes(mistakes: number): number {
  if (mistakes === 0) return 3;
  if (mistakes <= 2) return 2;
  return 1;
}

// Record a finished run — keep the best result.
export function recordResult(variantId: string, mistakes: number): VariantProgress {
  const map = loadProgress();
  const stars = starsFromMistakes(mistakes);
  const prev = map[variantId];
  const next: VariantProgress = prev
    ? {
        stars: Math.max(prev.stars, stars),
        mistakes:
          stars >= prev.stars
            ? Math.min(prev.mistakes, mistakes)
            : prev.mistakes,
      }
    : { stars, mistakes };
  map[variantId] = next;
  saveProgress(map);
  return next;
}
