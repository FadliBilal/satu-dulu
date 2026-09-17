// ==============================================================================
// SATUDULU — Pairwise Prioritization Engine
// Tagline: "Which matters more tomorrow?"
// ==============================================================================

export interface PrioritizationCandidate {
  id: string;
  title: string;
  description?: string | null;
  why_it_matters?: string | null;
  estimated_duration?: number;
  inbox_item_id?: string | null;
  rollover_count?: number;
}

export interface PairwiseComparison {
  itemA: PrioritizationCandidate;
  itemB: PrioritizationCandidate;
}

export interface PairwiseResult {
  candidate: PrioritizationCandidate;
  wins: number;
  losses: number;
  score: number;
  priorityLabel: "Prioritas tinggi" | "Direkomendasikan untuk besok" | "Pertimbangkan untuk nanti";
}

/**
 * Generates an optimal sequence of candidate pairs to minimize comparisons.
 * Uses Swiss-system / tournament pairing so user only needs 2 to 5 comparisons.
 */
export function generatePairs(candidates: PrioritizationCandidate[], maxPairs: number = 6): PairwiseComparison[] {
  if (candidates.length < 2) return [];

  const pairs: PairwiseComparison[] = [];
  const n = candidates.length;

  // Generate adjacent and cross pairs up to maxPairs
  for (let i = 0; i < n - 1; i++) {
    for (let j = i + 1; j < n; j++) {
      pairs.push({
        itemA: candidates[i],
        itemB: candidates[j],
      });
      if (pairs.length >= maxPairs) {
        return pairs;
      }
    }
  }

  return pairs;
}

/**
 * Computes ranked candidates based on pairwise choices.
 * User choices: map of "itemA_id:itemB_id" -> chosenWinnerId
 */
export function rankCandidatesByPairwise(
  candidates: PrioritizationCandidate[],
  choices: Record<string, string>
): PairwiseResult[] {
  const scoreMap: Record<string, { wins: number; losses: number }> = {};

  for (const c of candidates) {
    scoreMap[c.id] = { wins: 0, losses: 0 };
  }

  for (const [key, winnerId] of Object.entries(choices)) {
    const [aId, bId] = key.split(":");
    const loserId = winnerId === aId ? bId : aId;

    if (scoreMap[winnerId]) scoreMap[winnerId].wins += 1;
    if (scoreMap[loserId]) scoreMap[loserId].losses += 1;
  }

  const results: PairwiseResult[] = candidates.map((candidate) => {
    const stats = scoreMap[candidate.id] || { wins: 0, losses: 0 };
    // Rollover bonus: if carried forward, it deserves conscious attention
    const rolloverBonus = (candidate.rollover_count || 0) * 0.2;
    const score = stats.wins - stats.losses * 0.5 + rolloverBonus;

    return {
      candidate,
      wins: stats.wins,
      losses: stats.losses,
      score,
      priorityLabel: "Direkomendasikan untuk besok",
    };
  });

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  // Assign calm descriptive labels without raw math
  return results.map((res, index) => {
    let label: "Prioritas tinggi" | "Direkomendasikan untuk besok" | "Pertimbangkan untuk nanti" = "Pertimbangkan untuk nanti";
    if (index === 0 || (index === 1 && res.wins > 0)) {
      label = "Prioritas tinggi";
    } else if (index < 4) {
      label = "Direkomendasikan untuk besok";
    }

    return {
      ...res,
      priorityLabel: label,
    };
  });
}
