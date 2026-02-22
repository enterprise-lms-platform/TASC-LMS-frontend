// ── Grading Scale ──
export type GradingScale = 'letter' | 'percentage' | 'pass_fail';

// ── Weighting Mode ──
export type WeightingMode = 'weighted' | 'equal_points';

// ── Grade Category (for weighting) ──
export interface GradeCategory {
  id: string;
  name: string;
  weight: number; // percentage, e.g. 40
  color: string;
}

// ── Course-level grading configuration ──
export interface GradingConfig {
  gradingScale: GradingScale;
  weightingMode: WeightingMode;
  categories: GradeCategory[];
  passingThreshold: number; // used for pass/fail and minimum passing
  letterGradeThresholds: { A: number; B: number; C: number; D: number };
}

// ── Defaults ──
const defaultCategories: GradeCategory[] = [
  { id: 'assignments', name: 'Assignments', weight: 40, color: '#3b82f6' },
  { id: 'quizzes', name: 'Quizzes', weight: 30, color: '#8b5cf6' },
  { id: 'projects', name: 'Projects', weight: 20, color: '#10b981' },
  { id: 'participation', name: 'Participation', weight: 10, color: '#f59e0b' },
];

export function createDefaultGradingConfig(): GradingConfig {
  return {
    gradingScale: 'letter',
    weightingMode: 'weighted',
    categories: defaultCategories.map((c) => ({ ...c })),
    passingThreshold: 60,
    letterGradeThresholds: { A: 90, B: 80, C: 70, D: 60 },
  };
}

// ── Format a percentage into the display grade ──
export function formatGrade(percentage: number, config: GradingConfig): string {
  switch (config.gradingScale) {
    case 'letter': {
      const t = config.letterGradeThresholds;
      if (percentage >= t.A) return 'A';
      if (percentage >= t.B) return 'B';
      if (percentage >= t.C) return 'C';
      if (percentage >= t.D) return 'D';
      return 'F';
    }
    case 'percentage':
      return `${Math.round(percentage)}%`;
    case 'pass_fail':
      return percentage >= config.passingThreshold ? 'Pass' : 'Fail';
  }
}

// ── Color for a grade value ──
export function getGradeColor(percentage: number, config: GradingConfig): string {
  if (config.gradingScale === 'pass_fail') {
    return percentage >= config.passingThreshold ? '#10b981' : '#ef4444';
  }
  if (percentage >= 90) return '#10b981';
  if (percentage >= 80) return '#3b82f6';
  if (percentage >= 70) return '#f59e0b';
  if (percentage >= 60) return '#fb923c';
  return '#ef4444';
}

// ── Calculate final course grade ──
export interface CategoryGrade {
  categoryId: string;
  earned: number;
  possible: number;
}

export function calculateFinalGrade(
  grades: CategoryGrade[],
  config: GradingConfig,
): number {
  if (grades.length === 0) return 0;

  if (config.weightingMode === 'equal_points') {
    const totalEarned = grades.reduce((s, g) => s + g.earned, 0);
    const totalPossible = grades.reduce((s, g) => s + g.possible, 0);
    return totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;
  }

  // Weighted: each category contributes (earned/possible) * weight
  let weightedSum = 0;
  let totalWeight = 0;

  for (const grade of grades) {
    const category = config.categories.find((c) => c.id === grade.categoryId);
    if (!category || grade.possible === 0) continue;
    const categoryPct = (grade.earned / grade.possible) * 100;
    weightedSum += categoryPct * (category.weight / 100);
    totalWeight += category.weight;
  }

  // Normalize if not all categories have grades yet
  return totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
}
