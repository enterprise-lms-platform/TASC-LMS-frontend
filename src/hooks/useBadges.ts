import { useState, useEffect } from 'react';
import { BADGE_DEFINITIONS } from '../config/badgeDefinitions';
import type { BadgeDefinition } from '../config/badgeDefinitions';

// MOCK DATA for development until API #28 is ready
// Normally, this would be fetched from `GET /api/v1/learning/my-badges/`
const MOCK_EARNED_BADGE_IDS = [1, 6, 9, 12, 19, 21];

export interface EarnedBadge extends BadgeDefinition {
  earned_at: string;
}

export const useBadges = () => {
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([]);
  const [lockedBadges, setLockedBadges] = useState<BadgeDefinition[]>([]);
  const [newlyEarnedBadges, setNewlyEarnedBadges] = useState<EarnedBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const fetchBadges = async () => {
      try {
        setIsLoading(true);
        // MOCK: Replace array with actual endpoint result when ready
        // const response = await apiClient.get('/api/v1/learning/my-badges/');
        // const earnedData = response.data;
        
        const earned: EarnedBadge[] = MOCK_EARNED_BADGE_IDS.map(id => {
          const def = BADGE_DEFINITIONS.find(b => b.id === id)!;
          return { ...def, earned_at: new Date().toISOString() };
        });

        const locked = BADGE_DEFINITIONS.filter(d => !MOCK_EARNED_BADGE_IDS.includes(d.id));

        setEarnedBadges(earned);
        setLockedBadges(locked);

        // Check for new badges using localStorage "tasc_seen_badges"
        const seenStored = localStorage.getItem('tasc_seen_badges');
        const seenIds: number[] = seenStored ? JSON.parse(seenStored) : [];

        const newBadges = earned.filter(b => !seenIds.includes(b.id));
        setNewlyEarnedBadges(newBadges);

      } catch (error) {
        console.error('Failed to fetch badges', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const markAsSeen = (badgeIds: number[]) => {
    const seenStored = localStorage.getItem('tasc_seen_badges');
    const seenIds: number[] = seenStored ? JSON.parse(seenStored) : [];
    const updatedSeen = Array.from(new Set([...seenIds, ...badgeIds]));
    localStorage.setItem('tasc_seen_badges', JSON.stringify(updatedSeen));
    setNewlyEarnedBadges(prev => prev.filter(b => !badgeIds.includes(b.id)));
  };

  return {
    allBadges: BADGE_DEFINITIONS,
    earnedBadges,
    lockedBadges,
    newlyEarnedBadges,
    markAsSeen,
    isLoading
  };
};
