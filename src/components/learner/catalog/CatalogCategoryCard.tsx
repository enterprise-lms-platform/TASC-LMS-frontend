import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Code, ShowChart, Security, Campaign, Palette } from '@mui/icons-material';

interface Category {
  id: string;
  name: string;
  description: string;
  courseCount: number;
  startingPrice: number;
  icon: React.ReactNode;
  color: string;
  gradientEnd: string;
}

interface CatalogCategoryCardProps {
  category: Category;
  onClick?: (category: Category) => void;
}

// Default categories for export
export const defaultCategories: Category[] = [
  {
    id: 'web',
    name: 'Web Development',
    description: 'Build modern websites and web applications with the latest technologies',
    courseCount: 42,
    startingPrice: 19.99,
    icon: <Code />,
    color: '#ff6b6b',
    gradientEnd: '#ff8e8e',
  },
  {
    id: 'data',
    name: 'Data Science',
    description: 'Master data analysis, machine learning, and visualization techniques',
    courseCount: 28,
    startingPrice: 29.99,
    icon: <ShowChart />,
    color: '#4ecdc4',
    gradientEnd: '#7ae6d8',
  },
  {
    id: 'security',
    name: 'Cybersecurity',
    description: 'Learn to protect systems and networks from digital attacks',
    courseCount: 15,
    startingPrice: 24.99,
    icon: <Security />,
    color: '#45b7d1',
    gradientEnd: '#6acae7',
  },
  {
    id: 'marketing',
    name: 'Digital Marketing',
    description: 'Develop comprehensive digital marketing strategies for modern businesses',
    courseCount: 24,
    startingPrice: 19.99,
    icon: <Campaign />,
    color: '#96ceb4',
    gradientEnd: '#b8e0cc',
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Create stunning visual designs and user experiences',
    courseCount: 18,
    startingPrice: 24.99,
    icon: <Palette />,
    color: '#feca57',
    gradientEnd: '#ffe082',
  },
];

const CatalogCategoryCard: React.FC<CatalogCategoryCardProps> = ({ category, onClick }) => {
  return (
    <Card
      onClick={() => onClick?.(category)}
      sx={{
        cursor: 'pointer',
        borderRadius: 3,
        border: '1px solid #e4e4e7',
        borderTop: `4px solid ${category.color}`,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Icon */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${category.color}, ${category.gradientEnd})`,
            color: 'white',
            mb: 3,
            '& .MuiSvgIcon-root': {
              fontSize: 28,
            },
          }}
        >
          {category.icon}
        </Box>

        {/* Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#27272a',
            mb: 1,
          }}
        >
          {category.name}
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: '0.875rem',
            color: '#71717a',
            mb: 3,
            lineHeight: 1.5,
          }}
        >
          {category.description}
        </Typography>

        {/* Stats */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            color: '#52525b',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {category.courseCount} courses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            From ${category.startingPrice}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CatalogCategoryCard;
