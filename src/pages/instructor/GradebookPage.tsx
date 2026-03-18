import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, CssBaseline, Toolbar, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Sidebar, { DRAWER_WIDTH } from '../../components/instructor/Sidebar';
import GradebookTopBar from '../../components/instructor/gradebook/GradebookTopBar';
import GradebookToolbar from '../../components/instructor/gradebook/GradebookToolbar';
import GradebookSummaryCards from '../../components/instructor/gradebook/GradebookSummaryCards';
import GradebookTable from '../../components/instructor/gradebook/GradebookTable';
import type { GradebookStudent, GradedItem, GradeEntry } from '../../components/instructor/gradebook/GradebookTable';
import GradeDistributionChart from '../../components/instructor/gradebook/GradeDistributionChart';
import StudentGradeDetailPanel from '../../components/instructor/gradebook/StudentGradeDetailPanel';
import ExportDialog from '../../components/instructor/gradebook/ExportDialog';
import { createDefaultGradingConfig, formatGrade, calculateFinalGrade } from '../../utils/gradingUtils';
import type { GradingConfig } from '../../utils/gradingUtils';
import { submissionApi } from '../../services/learning.services';
import type { Submission } from '../../types/types';

function mapSubmissionStatus(s: Submission): 'graded' | 'submitted' | 'pending' | 'missing' {
  if (s.status === 'graded' && s.grade != null) return 'graded';
  if (s.status === 'submitted' || s.status === 'pending_review') return 'submitted';
  if (s.status === 'draft') return 'pending';
  return 'missing';
}

function buildGradebookData(submissions: Submission[]) {
  const studentMap = new Map<number, GradebookStudent>();
  const itemMap = new Map<number, GradedItem>();
  const grades: GradeEntry[] = [];

  for (const sub of submissions) {
    if (!studentMap.has(sub.user)) {
      const name = sub.user_name || sub.user_email;
      const initials = name.split(' ').map((n) => n[0]?.toUpperCase() || '').join('').slice(0, 2);
      studentMap.set(sub.user, { id: String(sub.user), name, initials, email: sub.user_email });
    }
    if (!itemMap.has(sub.assignment)) {
      itemMap.set(sub.assignment, {
        id: String(sub.assignment),
        title: sub.assignment_title || `Assignment ${sub.assignment}`,
        type: 'assignment',
        categoryId: 'assignments',
        maxScore: 100,
        dueDate: '',
      });
    }
    grades.push({
      studentId: String(sub.user),
      itemId: String(sub.assignment),
      earned: sub.grade ?? null,
      status: mapSubmissionStatus(sub),
    });
  }

  return {
    students: Array.from(studentMap.values()),
    items: Array.from(itemMap.values()),
    grades,
  };
}

// ── Page Component ──

const GradebookPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gradingConfig] = useState<GradingConfig>(createDefaultGradingConfig());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('expanded');
  const [detailStudentId, setDetailStudentId] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  // Fetch all submissions for the instructor
  const { data: submissionsRes, isLoading } = useQuery({
    queryKey: ['instructor-submissions'],
    queryFn: () => submissionApi.getAll(),
  });

  const rawSubs = submissionsRes?.data;
  const submissions: Submission[] = Array.isArray(rawSubs) ? rawSubs : (rawSubs as any)?.results || [];

  const { students: allStudents, items: allItems, grades: allGrades } = useMemo(
    () => buildGradebookData(submissions),
    [submissions],
  );

  // Filter students by search
  const filteredStudents = useMemo(
    () =>
      allStudents.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, allStudents],
  );

  // Compute summary stats
  const summaryStats = useMemo(() => {
    const studentFinalGrades = allStudents.map((student) => {
      const studentGrades = allGrades.filter((g) => g.studentId === student.id && g.earned !== null);
      const categoryGrades = gradingConfig.categories.map((cat) => {
        const catItems = allItems.filter((i) => i.categoryId === cat.id);
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
    });

    const classAverage = studentFinalGrades.length > 0
      ? studentFinalGrades.reduce((s, g) => s + g, 0) / studentFinalGrades.length
      : 0;
    const pendingCount = allGrades.filter((g) => g.status === 'submitted' || g.status === 'pending').length;

    return {
      classAverage,
      gradedItemCount: allItems.length,
      totalStudents: allStudents.length,
      pendingGradingCount: pendingCount,
    };
  }, [gradingConfig, allStudents, allItems, allGrades]);

  // Grade distribution
  const distribution = useMemo(() => {
    const dist: Record<string, number> = {};

    if (gradingConfig.gradingScale === 'pass_fail') {
      dist['Pass'] = 0;
      dist['Fail'] = 0;
    } else if (gradingConfig.gradingScale === 'letter') {
      dist['A'] = 0;
      dist['B'] = 0;
      dist['C'] = 0;
      dist['D'] = 0;
      dist['F'] = 0;
    }

    allStudents.forEach((student) => {
      const studentGrades = allGrades.filter((g) => g.studentId === student.id && g.earned !== null);
      const categoryGrades = gradingConfig.categories.map((cat) => {
        const catItems = allItems.filter((i) => i.categoryId === cat.id);
        const catGrades = catItems
          .map((item) => studentGrades.find((g) => g.itemId === item.id))
          .filter((g): g is GradeEntry => g !== undefined && g.earned !== null);
        return {
          categoryId: cat.id,
          earned: catGrades.reduce((s, g) => s + (g.earned ?? 0), 0),
          possible: catItems.reduce((s, i) => s + i.maxScore, 0),
        };
      }).filter((cg) => cg.possible > 0);

      const finalPct = calculateFinalGrade(categoryGrades, gradingConfig);
      const grade = formatGrade(finalPct, gradingConfig);
      dist[grade] = (dist[grade] || 0) + 1;
    });

    return dist;
  }, [gradingConfig, allStudents, allItems, allGrades]);

  // Detail panel data
  const detailStudent = detailStudentId ? allStudents.find((s) => s.id === detailStudentId) ?? null : null;
  const detailGrades = detailStudentId
    ? allGrades
        .filter((g) => g.studentId === detailStudentId)
        .map((g) => ({
          itemId: g.itemId,
          earned: g.earned,
          possible: allItems.find((i) => i.id === g.itemId)?.maxScore ?? 0,
          status: g.status,
        }))
    : [];
  const detailFinalGrade = useMemo(() => {
    if (!detailStudentId) return 0;
    const studentGrades = allGrades.filter((g) => g.studentId === detailStudentId && g.earned !== null);
    const categoryGrades = gradingConfig.categories.map((cat) => {
      const catItems = allItems.filter((i) => i.categoryId === cat.id);
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
  }, [detailStudentId, gradingConfig, allGrades, allItems]);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <GradebookTopBar
        courseName="Gradebook"
        onBack={() => navigate('/instructor')}
        onExport={() => setExportOpen(true)}
        onSettings={() => navigate('/instructor/course/create')}
        onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {!isLoading && allStudents.length === 0 && (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
              No submissions found. Grades will appear here once learners submit assignments.
            </Typography>
          )}

          {!isLoading && allStudents.length > 0 && (
            <>
              {/* Summary Cards */}
              <GradebookSummaryCards
                classAverage={summaryStats.classAverage}
                gradedItemCount={summaryStats.gradedItemCount}
                totalStudents={summaryStats.totalStudents}
                pendingGradingCount={summaryStats.pendingGradingCount}
                gradingConfig={gradingConfig}
              />

              {/* Toolbar */}
              <GradebookToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeCategory={categoryFilter}
                categories={gradingConfig.categories}
                onCategoryFilter={setCategoryFilter}
                gradingScale={gradingConfig.gradingScale}
                weightingMode={gradingConfig.weightingMode}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              {/* Two-column: Table + Distribution */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', xl: '1fr 300px' },
                  gap: 3,
                }}
              >
                {/* Gradebook Table */}
                <GradebookTable
                  students={filteredStudents}
                  gradedItems={allItems}
                  grades={allGrades}
                  categories={gradingConfig.categories}
                  gradingConfig={gradingConfig}
                  onCellClick={() => {}}
                  onStudentClick={(studentId) => setDetailStudentId(studentId)}
                  viewMode={viewMode}
                  categoryFilter={categoryFilter}
                />

                {/* Sidebar: Distribution */}
                <Box sx={{ display: { xs: 'none', xl: 'block' } }}>
                  <GradeDistributionChart distribution={distribution} gradingConfig={gradingConfig} />
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Student Detail Panel */}
      <StudentGradeDetailPanel
        open={!!detailStudentId}
        onClose={() => setDetailStudentId(null)}
        student={detailStudent}
        grades={detailGrades}
        gradedItems={allItems}
        categories={gradingConfig.categories}
        gradingConfig={gradingConfig}
        finalGrade={detailFinalGrade}
      />

      {/* Export Dialog */}
      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        onExport={(options) => console.log('Exporting:', options)}
      />
    </Box>
  );
};

export default GradebookPage;
