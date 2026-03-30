import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../utils/config';
import type { BadgeDefinition } from '../config/badgeDefinitions';
import { BADGE_DEFINITIONS } from '../config/badgeDefinitions';

// ── API types ──

interface ApiBadge {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon_url: string;
  category: string;
  criteria_type: string;
  criteria_value: number;
  order: number;
}

interface ApiUserBadge {
  id: number;
  badge: ApiBadge;
  earned_at: string;
}

export interface EarnedBadge extends BadgeDefinition {
  earned_at: string;
}

// ── Map API badge → frontend BadgeDefinition format ──

const CATEGORY_MAP: Record<string, string> = {
  course_completion: 'course_completion',
  enrollment: 'enrollment_milestones',
  subscription: 'subscription_loyalty',
  assessment: 'assessment_excellence',
  engagement: 'engagement',
  milestone: 'milestones',
};

function apiBadgeToDefinition(b: ApiBadge): BadgeDefinition {
  return {
    id: b.id,
    slug: b.slug,
    title: b.name,
    description: b.description,
    category_id: CATEGORY_MAP[b.category] || b.category,
    image_url: b.icon_url || `/badges/${b.slug}.png`,
  };
}

// ── Hooks ──

export const useBadges = () => {
  const { data: apiBadges, isLoading: badgesLoading } = useQuery<ApiBadge[]>({
    queryKey: ['badges'],
    queryFn: () =>
      apiClient
        .get('/api/v1/learning/badges/')
        .then((r) => {
          const data = r.data;
          return Array.isArray(data) ? data : (data as any).results ?? [];
        }),
  });

  const { data: apiEarned, isLoading: earnedLoading } = useQuery<ApiUserBadge[]>({
    queryKey: ['badges', 'my-badges'],
    queryFn: () =>
      apiClient.get('/api/v1/learning/badges/my-badges/').then((r) => r.data),
  });

  const isLoading = badgesLoading || earnedLoading;

  // Use API badges if available, fall back to local definitions
  const allBadges: BadgeDefinition[] =
    apiBadges && apiBadges.length > 0
      ? apiBadges.map(apiBadgeToDefinition)
      : BADGE_DEFINITIONS;

  // Map earned API data
  const earnedBadges: EarnedBadge[] = (apiEarned || []).map((ub) => {
    const def = apiBadgeToDefinition(ub.badge);
    return { ...def, earned_at: ub.earned_at };
  });

  const earnedIds = new Set(earnedBadges.map((b) => b.id));
  const lockedBadges = allBadges.filter((b) => !earnedIds.has(b.id));

  // Check for new badges using localStorage "tasc_seen_badges"
  const seenStored = typeof window !== 'undefined' ? localStorage.getItem('tasc_seen_badges') : null;
  const seenIds: number[] = seenStored ? JSON.parse(seenStored) : [];
  const newlyEarnedBadges = earnedBadges.filter((b) => !seenIds.includes(b.id));

  const markAsSeen = (badgeIds: number[]) => {
    const stored = localStorage.getItem('tasc_seen_badges');
    const seen: number[] = stored ? JSON.parse(stored) : [];
    const updated = Array.from(new Set([...seen, ...badgeIds]));
    localStorage.setItem('tasc_seen_badges', JSON.stringify(updated));
  };

  return {
    allBadges,
    earnedBadges,
    lockedBadges,
    newlyEarnedBadges,
    markAsSeen,
    isLoading,
  };
};
