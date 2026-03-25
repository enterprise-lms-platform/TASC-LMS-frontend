import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, CssBaseline, Toolbar, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
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
import { submissionApi, gradeStatisticsApi } from '../../services/learning.services';
import { courseApi } from '../../services/catalogue.services';

const sampleStudents: GradebookStudent[] = [];
const sampleItems: GradedItem[] = [];
const sampleGrades: GradeEntry[] = [];

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
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', 'instructor'],
    queryFn: () => courseApi.getAll({ instructor_courses: true, limit: 100 }).then(r => r.data),
  });

  const courses = coursesData?.results ?? [];

  const { data: submissionsData, isLoading: submissionsLoading } = useQuery({
    queryKey: ['submissions', 'gradebook', selectedCourseId],
    queryFn: () => submissionApi.getAll({ course: selectedCourseId ?? undefined }).then(r => r.data),
    enabled: selectedCourseId !== null,
  });

  const { data: statsData } = useQuery({
    queryKey: ['submissions', 'statistics', selectedCourseId],
    queryFn: () => gradeStatisticsApi.getStatistics(selectedCourseId!).then(r => r.data),
    enabled: selectedCourseId !== null,
  });

  const submissions = (Array.isArray(submissionsData) ? submissionsData : []) as Array<{
    id: number; assignment: number; assignment_title: string; session: number; session_title: string;
    enrollment: number; user: number; user_name: string; user_email: string;
    status: string; submitted_at: string; grade?: number | null; feedback?: string | null;
  }>;

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  const realStudents = useMemo((): GradebookStudent[] => {
    const seen = new Map<number, GradebookStudent>();
    submissions.forEach(s => {
      if (!seen.has(s.enrollment)) {
        const parts = s.user_name.split(' ');
        seen.set(s.enrollment, {
          id: String(s.enrollment),
          name: s.user_name,
          initials: parts.map(p => p[0]).join('').slice(0, 2).toUpperCase(),
          email: s.user_email,
        });
      }
    });
    return Array.from(seen.values());
  }, [submissions]);

  const realItems = useMemo((): GradedItem[] => {
    const seen = new Map<number, GradedItem>();
    submissions.forEach(s => {
      if (!seen.has(s.assignment)) {
        const isQuiz = s.session_title?.toLowerCase().includes('quiz') || s.assignment_title?.toLowerCase().includes('quiz');
        const isProject = s.assignment_title?.toLowerCase().includes('project') || s.session_title?.toLowerCase().includes('project');
        seen.set(s.assignment, {
          id: String(s.assignment),
          title: s.assignment_title || s.session_title || 'Assessment',
          type: isQuiz ? 'quiz' : isProject ? 'project' : 'assignment',
          categoryId: isQuiz ? 'quizzes' : isProject ? 'projects' : 'assignments',
          maxScore: 100,
          dueDate: new Date(s.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        });
      }
    });
    return Array.from(seen.values());
  }, [submissions]);

  const realGrades = useMemo((): GradeEntry[] => {
    return submissions.map(s => ({
      studentId: String(s.enrollment),
      itemId: String(s.assignment),
      earned: s.grade ?? null,
      status: (s.status === 'graded' ? 'graded' : s.status === 'submitted' ? 'submitted' : 'pending') as GradeEntry['status'],
    }));
  }, [submissions]);

  const students = realStudents.length > 0 ? realStudents : sampleStudents;
  const gradedItems = realItems.length > 0 ? realItems : sampleItems;
  const grades = realGrades.length > 0 ? realGrades : sampleGrades;

  const filteredStudents = useMemo(
    () => students.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [students, searchQuery],
  );

  const summaryStats = useMemo(() => {
    const studentFinalGrades = students.map((student) => {
      const studentGrades = grades.filter((g) => g.studentId === student.id && g.earned !== null);
      const categoryGrades = gradingConfig.categories.map((cat) => {
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
    });

    const classAverage = studentFinalGrades.length > 0
      ? studentFinalGrades.reduce((s, g) => s + g, 0) / studentFinalGrades.length
      : (statsData?.average_grade ?? 0);
    const pendingCount = grades.filter((g) => g.status === 'submitted' || g.status === 'pending').length;

    return {
      classAverage,
      gradedItemCount: gradedItems.length,
      totalStudents: students.length,
      pendingGradingCount: pendingCount,
    };
  }, [students, grades, gradedItems, gradingConfig, statsData]);

  const distribution = useMemo(() => {
    if (statsData?.distribution) {
      const dist: Record<string, number> = {};
      statsData.distribution.forEach(d => {
        dist[d.label] = d.count;
      });
      return dist;
    }
    const dist: Record<string, number> = {};
    if (gradingConfig.gradingScale === 'letter') {
      ['A', 'B', 'C', 'D', 'F'].forEach(g => { dist[g] = 0; });
    }
    students.forEach((student) => {
      const studentGrades = grades.filter((g) => g.studentId === student.id && g.earned !== null);
      const categoryGrades = gradingConfig.categories.map((cat) => {
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
      const finalPct = calculateFinalGrade(categoryGrades, gradingConfig);
      const grade = formatGrade(finalPct, gradingConfig);
      dist[grade] = (dist[grade] || 0) + 1;
    });
    return dist;
  }, [students, grades, gradedItems, gradingConfig, statsData]);

  const detailStudent = detailStudentId ? students.find((s) => s.id === detailStudentId) ?? null : null;
  const detailGrades = detailStudentId
    ? grades.filter((g) => g.studentId === detailStudentId).map((g) => ({
        itemId: g.itemId,
        earned: g.earned,
        possible: gradedItems.find((i) => i.id === g.itemId)?.maxScore ?? 0,
        status: g.status,
      }))
    : [];
  const detailFinalGrade = useMemo(() => {
    if (!detailStudentId) return 0;
    const studentGrades = grades.filter((g) => g.studentId === detailStudentId && g.earned !== null);
    const categoryGrades = gradingConfig.categories.map((cat) => {
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
  }, [detailStudentId, grades, gradedItems, gradingConfig]);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <GradebookTopBar
        courseName={selectedCourse?.title || 'Select a course'}
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
          {/* Course Selector */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 280 }}>
              <InputLabel>Select Course</InputLabel>
              <Select
                value={selectedCourseId ?? ''}
                label="Select Course"
                onChange={(e) => setSelectedCourseId(e.target.value ? Number(e.target.value) : null)}
              >
                {coursesLoading ? (
                  <MenuItem value="" disabled>
                    <CircularProgress size={16} sx={{ mr: 1 }} /> Loading courses...
                  </MenuItem>
                ) : courses.length > 0 ? (
                  courses.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.title}</MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>No courses found</MenuItem>
                )}
              </Select>
            </FormControl>
            {submissionsLoading && selectedCourseId && (
              <Typography variant="body2" color="text.secondary">
                Loading submissions...
              </Typography>
            )}
          </Box>

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
              gradedItems={gradedItems}
              grades={grades}
              categories={gradingConfig.categories}
              gradingConfig={gradingConfig}
              onCellClick={(studentId, itemId) => console.log('Grade cell clicked:', studentId, itemId)}
              onStudentClick={(studentId) => setDetailStudentId(studentId)}
              viewMode={viewMode}
              categoryFilter={categoryFilter}
            />

            {/* Sidebar: Distribution */}
            <Box sx={{ display: { xs: 'none', xl: 'block' } }}>
              <GradeDistributionChart distribution={distribution} gradingConfig={gradingConfig} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Student Detail Panel */}
      <StudentGradeDetailPanel
        open={!!detailStudentId}
        onClose={() => setDetailStudentId(null)}
        student={detailStudent}
        grades={detailGrades}
        gradedItems={gradedItems}
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
