import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  LinearProgress,
  Divider,
  Chip,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { formatGrade, getGradeColor } from '../../../utils/gradingUtils';
import type { GradingConfig, GradeCategory } from '../../../utils/gradingUtils';

interface GradeEntry {
  itemId: string;
  earned: number | null;
  possible: number;
  status: 'graded' | 'submitted' | 'pending' | 'missing';
}

interface GradedItem {
  id: string;
  title: string;
  categoryId: string;
  maxScore: number;
}

interface StudentData {
  id: string;
  name: string;
  initials: string;
  email: string;
}

interface StudentGradeDetailPanelProps {
  open: boolean;
  onClose: () => void;
  student: StudentData | null;
  grades: GradeEntry[];
  gradedItems: GradedItem[];
  categories: GradeCategory[];
  gradingConfig: GradingConfig;
  finalGrade: number;
}

const StudentGradeDetailPanel: React.FC<StudentGradeDetailPanelProps> = ({
  open,
  onClose,
  student,
  grades,
  gradedItems,
  categories,
  gradingConfig,
  finalGrade,
}) => {
  if (!student) return null;

  const getCategoryGrades = (categoryId: string) => {
    const items = gradedItems.filter((i) => i.categoryId === categoryId);
    const catGrades = items.map((item) => {
      const grade = grades.find((g) => g.itemId === item.id);
      return { item, grade };
    });
    const earned = catGrades.reduce((s, g) => s + (g.grade?.earned ?? 0), 0);
    const possible = catGrades.reduce((s, g) => s + g.item.maxScore, 0);
    return { items: catGrades, earned, possible, pct: possible > 0 ? (earned / possible) * 100 : 0 };
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ '& .MuiDrawer-paper': { width: 380 } }}>
      {/* Header */}
      <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontWeight: 700 }}>
              {student.initials}
            </Avatar>
            <Box>
              <Typography fontWeight={700}>{student.name}</Typography>
              <Typography variant="body2" color="text.secondary">{student.email}</Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Final grade */}
        <Box
          sx={{
            p: 2,
            background: 'linear-gradient(135deg, #ffb74d, #f97316)',
            borderRadius: 2,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>Final Grade</Typography>
            <Typography variant="h4" fontWeight={700}>{formatGrade(finalGrade, gradingConfig)}</Typography>
          </Box>
          <Typography variant="h5" fontWeight={600}>{Math.round(finalGrade)}%</Typography>
        </Box>
      </Box>

      {/* Category breakdowns */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {categories.map((cat) => {
          const catData = getCategoryGrades(cat.id);
          return (
            <Box key={cat.id} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: cat.color }} />
                  <Typography variant="body2" fontWeight={700}>{cat.name}</Typography>
                  {gradingConfig.weightingMode === 'weighted' && (
                    <Typography variant="caption" color="text.secondary">({cat.weight}%)</Typography>
                  )}
                </Box>
                <Typography variant="body2" fontWeight={600} sx={{ color: getGradeColor(catData.pct, gradingConfig) }}>
                  {formatGrade(catData.pct, gradingConfig)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={catData.pct}
                sx={{
                  height: 6,
                  borderRadius: 1,
                  mb: 1.5,
                  bgcolor: 'grey.100',
                  '& .MuiLinearProgress-bar': { bgcolor: cat.color },
                }}
              />
              {catData.items.map(({ item, grade }) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75, px: 1 }}>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                    {item.title}
                  </Typography>
                  {grade?.earned !== null && grade?.earned !== undefined ? (
                    <Typography variant="caption" fontWeight={600}>
                      {grade.earned}/{item.maxScore}
                    </Typography>
                  ) : (
                    <Chip label={grade?.status ?? 'pending'} size="small" sx={{ height: 18, fontSize: '0.6rem', textTransform: 'capitalize' }} />
                  )}
                </Box>
              ))}
              <Divider sx={{ mt: 1 }} />
            </Box>
          );
        })}
      </Box>
    </Drawer>
  );
};

export default StudentGradeDetailPanel;
