// "Smart repetition" — pick the variant the user should practice next.
// Priority buckets (best → worst slot):
//   1★ → 2★ → unplayed → 3★
// Inside a played bucket, sort by mistakes DESC (worst first).
// Among unplayed, take the first by declaration order.

import { OPENINGS, type Variant } from "../data/openings";
import type { ProgressMap } from "./storage";

interface CandidateRow {
  variant: Variant;
  openingId: string;
}

function allVariants(): CandidateRow[] {
  const rows: CandidateRow[] = [];
  for (const o of OPENINGS) {
    for (const v of o.variants) {
      rows.push({ variant: v, openingId: o.id });
    }
  }
  return rows;
}

export interface Recommendation {
  openingId: string;
  variantId: string;
  reason: "1star" | "2star" | "unplayed" | "3star";
}

export function recommend(
  progress: ProgressMap,
  excludeVariantId?: string,
): Recommendation | null {
  const rows = allVariants().filter(
    (r) => r.variant.id !== excludeVariantId,
  );
  if (rows.length === 0) return null;

  const oneStar = rows
    .filter((r) => progress[r.variant.id]?.stars === 1)
    .sort(
      (a, b) =>
        (progress[b.variant.id]?.mistakes ?? 0) -
        (progress[a.variant.id]?.mistakes ?? 0),
    );
  if (oneStar.length) {
    return {
      openingId: oneStar[0].openingId,
      variantId: oneStar[0].variant.id,
      reason: "1star",
    };
  }

  const twoStar = rows
    .filter((r) => progress[r.variant.id]?.stars === 2)
    .sort(
      (a, b) =>
        (progress[b.variant.id]?.mistakes ?? 0) -
        (progress[a.variant.id]?.mistakes ?? 0),
    );
  if (twoStar.length) {
    return {
      openingId: twoStar[0].openingId,
      variantId: twoStar[0].variant.id,
      reason: "2star",
    };
  }

  const unplayed = rows.filter((r) => !progress[r.variant.id]);
  if (unplayed.length) {
    return {
      openingId: unplayed[0].openingId,
      variantId: unplayed[0].variant.id,
      reason: "unplayed",
    };
  }

  const threeStar = rows
    .filter((r) => progress[r.variant.id]?.stars === 3)
    .sort(
      (a, b) =>
        (progress[b.variant.id]?.mistakes ?? 0) -
        (progress[a.variant.id]?.mistakes ?? 0),
    );
  if (threeStar.length) {
    return {
      openingId: threeStar[0].openingId,
      variantId: threeStar[0].variant.id,
      reason: "3star",
    };
  }

  return null;
}
