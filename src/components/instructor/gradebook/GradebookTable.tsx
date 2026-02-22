import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
} from '@mui/material';
import GradeCell from './GradeCell';
import CategoryHeader from './CategoryHeader';
import { formatGrade, getGradeColor, calculateFinalGrade } from '../../../utils/gradingUtils';
import type { GradingConfig, GradeCategory } from '../../../utils/gradingUtils';

export interface GradebookStudent {
  id: string;
  name: string;
  initials: string;
  email: string;
}

export interface GradedItem {
  id: string;
  title: string;
  type: 'assignment' | 'quiz' | 'project' | 'participation';
  categoryId: string;
  maxScore: number;
  dueDate: string;
}

export interface GradeEntry {
  studentId: string;
  itemId: string;
  earned: number | null;
  status: 'graded' | 'submitted' | 'pending' | 'missing';
}

interface GradebookTableProps {
  students: GradebookStudent[];
  gradedItems: GradedItem[];
  grades: GradeEntry[];
  categories: GradeCategory[];
  gradingConfig: GradingConfig;
  onCellClick: (studentId: string, itemId: string) => void;
  onStudentClick: (studentId: string) => void;
  viewMode: 'compact' | 'expanded';
  categoryFilter: string | null;
}

const GradebookTable: React.FC<GradebookTableProps> = ({
  students,
  gradedItems,
  grades,
  categories,
  gradingConfig,
  onCellClick,
  onStudentClick,
  viewMode,
  categoryFilter,
}) => {
  const compact = viewMode === 'compact';

  // Filter items by category if filter is active
  const filteredItems = categoryFilter
    ? gradedItems.filter((i) => i.categoryId === categoryFilter)
    : gradedItems;

  // Group items by category
  const categoriesWithItems = categories
    .map((cat) => ({
      category: cat,
      items: filteredItems.filter((i) => i.categoryId === cat.id),
    }))
    .filter((g) => g.items.length > 0);

  const getGrade = (studentId: string, itemId: string): GradeEntry | undefined => {
    return grades.find((g) => g.studentId === studentId && g.itemId === itemId);
  };

  const getStudentFinalGrade = (studentId: string): number => {
    const studentGrades = grades.filter((g) => g.studentId === studentId && g.earned !== null);
    const categoryGrades = categories.map((cat) => {
      const catItems = gradedItems.filter((i) => i.categoryId === cat.id);
      const catGrades = catItems
        .map((item) => studentGrades.find((g) => g.itemId === item.id))
        .filter((g): g is GradeEntry => g !== undefined && g.earned !== null);
      return {
        categoryId: cat.id,
        earned: catGrades.reduce((s, g) => s + (g.earned ?? 0), 0),
        possible: catItems.reduce((s, i) => s + i.maxScore, 0),
      };
    }).filter((cg) => cg.possible > 0);

    return calculateFinalGrade(categoryGrades, gradingConfig);
  };

  const getColumnAverage = (itemId: string): number | null => {
    const item = gradedItems.find((i) => i.id === itemId);
    if (!item) return null;
    const itemGrades = grades.filter((g) => g.itemId === itemId && g.earned !== null);
    if (itemGrades.length === 0) return null;
    const avg = itemGrades.reduce((s, g) => s + (g.earned ?? 0), 0) / itemGrades.length;
    return (avg / item.maxScore) * 100;
  };

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size={compact ? 'small' : 'medium'}>
          <TableHead>
            {/* Category row */}
            <TableRow>
              <TableCell
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 3,
                  bgcolor: 'grey.50',
                  minWidth: 200,
                  borderBottom: 0,
                }}
              />
              {categoriesWithItems.map(({ category, items }) => (
                <CategoryHeader
                  key={category.id}
                  category={category}
                  itemCount={items.length}
                  showWeight={gradingConfig.weightingMode === 'weighted'}
                />
              ))}
              <TableCell sx={{ bgcolor: 'grey.50', borderBottom: `3px solid #f97316`, minWidth: 80 }} align="center">
                <Typography variant="caption" fontWeight={700}>Final</Typography>
              </TableCell>
            </TableRow>
            {/* Item names row */}
            <TableRow>
              <TableCell
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 3,
                  bgcolor: 'white',
                  minWidth: 200,
                }}
              >
                <Typography variant="caption" fontWeight={600} color="text.secondary">Student</Typography>
              </TableCell>
              {categoriesWithItems.flatMap(({ items }) =>
                items.map((item) => (
                  <TableCell key={item.id} align="center" sx={{ minWidth: 70, p: 1 }}>
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        maxWidth: 80,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={item.title}
                    >
                      {item.title}
                    </Typography>
                    {!compact && (
                      <Typography variant="caption" color="text.disabled" display="block">
                        /{item.maxScore}
                      </Typography>
                    )}
                  </TableCell>
                ))
              )}
              <TableCell align="center" sx={{ minWidth: 80 }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary">Grade</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => {
              const finalPct = getStudentFinalGrade(student.id);
              return (
                <TableRow
                  key={student.id}
                  hover
                  sx={{ '&:hover': { bgcolor: 'rgba(255, 164, 36, 0.04)' } }}
                >
                  {/* Student name (sticky) */}
                  <TableCell
                    sx={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 1,
                      bgcolor: 'white',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'grey.50' },
                    }}
                    onClick={() => onStudentClick(student.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: 'primary.main' }}>
                        {student.initials}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 140 }}>
                          {student.name}
                        </Typography>
                        {!compact && (
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {student.email}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Grade cells */}
                  {categoriesWithItems.flatMap(({ items }) =>
                    items.map((item) => {
                      const grade = getGrade(student.id, item.id);
                      return (
                        <GradeCell
                          key={item.id}
                          earned={grade?.earned ?? null}
                          possible={item.maxScore}
                          gradingConfig={gradingConfig}
                          status={grade?.status ?? 'pending'}
                          onClick={() => onCellClick(student.id, item.id)}
                          compact={compact}
                        />
                      );
                    })
                  )}

                  {/* Final grade */}
                  <TableCell align="center" sx={{ bgcolor: 'rgba(249, 115, 22, 0.04)' }}>
                    <Typography variant="body2" fontWeight={700} sx={{ color: getGradeColor(finalPct, gradingConfig) }}>
                      {formatGrade(finalPct, gradingConfig)}
                    </Typography>
                    {!compact && (
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(finalPct)}%
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Class average row */}
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                  bgcolor: 'grey.50',
                }}
              >
                <Typography variant="body2" fontWeight={700} color="text.secondary">
                  Class Average
                </Typography>
              </TableCell>
              {categoriesWithItems.flatMap(({ items }) =>
                items.map((item) => {
                  const avg = getColumnAverage(item.id);
                  return (
                    <TableCell key={item.id} align="center">
                      {avg !== null ? (
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                          {Math.round(avg)}%
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="text.disabled">—</Typography>
                      )}
                    </TableCell>
                  );
                })
              )}
              <TableCell align="center">
                <Typography variant="caption" fontWeight={700} color="primary.main">
                  {Math.round(
                    students.reduce((s, st) => s + getStudentFinalGrade(st.id), 0) / (students.length || 1)
                  )}%
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default GradebookTable;
