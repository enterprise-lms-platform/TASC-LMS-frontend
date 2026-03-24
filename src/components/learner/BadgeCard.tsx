import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import type { BadgeDefinition } from '../../config/badgeDefinitions';

interface BadgeCardProps {
  badge: BadgeDefinition;
  isEarned: boolean;
  earnedAt?: string;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isEarned, earnedAt }) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        borderRadius: 3, 
        border: '1px solid #e4e4e7',
        textAlign: 'center',
        transition: 'all 0.2s',
        bgcolor: isEarned ? '#ffffff' : '#fafafa',
        '&:hover': {
          borderColor: isEarned ? '#ffa424' : '#e4e4e7',
          boxShadow: isEarned ? '0 4px 12px rgba(255, 164, 36, 0.1)' : 'none',
        }
      }}
    >
      <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <Box 
          sx={{ 
            height: 120, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 2,
            filter: isEarned ? 'none' : 'grayscale(100%) opacity(0.4)',
            transition: 'filter 0.3s'
          }}
        >
          <img 
            src={badge.image_url} 
            alt={badge.title} 
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
          />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: isEarned ? '#18181b' : '#a1a1aa', mb: 1 }}>
          {badge.title}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: '#71717a', mb: isEarned ? 2 : 0, minHeight: 40, flexGrow: 1 }}>
          {badge.description}
        </Typography>
        {isEarned && earnedAt && (
          <Typography sx={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
            Earned: {new Date(earnedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgeCard;
