import React, { useState, useMemo } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';
import GradebookTopBar from '../components/instructor/gradebook/GradebookTopBar';
import GradebookToolbar from '../components/instructor/gradebook/GradebookToolbar';
import GradebookSummaryCards from '../components/instructor/gradebook/GradebookSummaryCards';
import GradebookTable from '../components/instructor/gradebook/GradebookTable';
import type { GradebookStudent, GradedItem, GradeEntry } from '../components/instructor/gradebook/GradebookTable';
import GradeDistributionChart from '../components/instructor/gradebook/GradeDistributionChart';
import StudentGradeDetailPanel from '../components/instructor/gradebook/StudentGradeDetailPanel';
import ExportDialog from '../components/instructor/gradebook/ExportDialog';
import { createDefaultGradingConfig, formatGrade, calculateFinalGrade } from '../utils/gradingUtils';
import type { GradingConfig } from '../utils/gradingUtils';

// ── Sample Data ──

const sampleStudents: GradebookStudent[] = [
  { id: 's1', name: 'Jennifer Smith', initials: 'JS', email: 'jennifer.smith@university.edu' },
  { id: 's2', name: 'Michael Chen', initials: 'MC', email: 'michael.chen@university.edu' },
  { id: 's3', name: 'Emma Wilson', initials: 'EW', email: 'emma.wilson@university.edu' },
  { id: 's4', name: 'David Johnson', initials: 'DJ', email: 'david.johnson@university.edu' },
  { id: 's5', name: 'Sarah Brown', initials: 'SB', email: 'sarah.brown@university.edu' },
  { id: 's6', name: 'James Taylor', initials: 'JT', email: 'james.taylor@university.edu' },
  { id: 's7', name: 'Olivia Davis', initials: 'OD', email: 'olivia.davis@university.edu' },
  { id: 's8', name: 'Daniel Martinez', initials: 'DM', email: 'daniel.martinez@university.edu' },
  { id: 's9', name: 'Sophia Anderson', initials: 'SA', email: 'sophia.anderson@university.edu' },
  { id: 's10', name: 'Liam Thomas', initials: 'LT', email: 'liam.thomas@university.edu' },
];

const sampleItems: GradedItem[] = [
  // Assignments
  { id: 'a1', title: 'Hook Library', type: 'assignment', categoryId: 'assignments', maxScore: 100, dueDate: 'Feb 10' },
  { id: 'a2', title: 'State Patterns', type: 'assignment', categoryId: 'assignments', maxScore: 100, dueDate: 'Feb 17' },
  { id: 'a3', title: 'HOC Essay', type: 'assignment', categoryId: 'assignments', maxScore: 50, dueDate: 'Feb 24' },
  // Quizzes
  { id: 'q1', title: 'Module 1 Quiz', type: 'quiz', categoryId: 'quizzes', maxScore: 30, dueDate: 'Feb 5' },
  { id: 'q2', title: 'Module 2 Quiz', type: 'quiz', categoryId: 'quizzes', maxScore: 30, dueDate: 'Feb 12' },
  { id: 'q3', title: 'Midterm Quiz', type: 'quiz', categoryId: 'quizzes', maxScore: 50, dueDate: 'Feb 19' },
  // Projects
  { id: 'p1', title: 'Final Project', type: 'project', categoryId: 'projects', maxScore: 200, dueDate: 'Mar 1' },
  { id: 'p2', title: 'Code Review', type: 'project', categoryId: 'projects', maxScore: 50, dueDate: 'Feb 20' },
];

const sampleGrades: GradeEntry[] = [
  // Jennifer Smith - strong student
  { studentId: 's1', itemId: 'a1', earned: 92, status: 'graded' },
  { studentId: 's1', itemId: 'a2', earned: 88, status: 'graded' },
  { studentId: 's1', itemId: 'a3', earned: 45, status: 'graded' },
  { studentId: 's1', itemId: 'q1', earned: 28, status: 'graded' },
  { studentId: 's1', itemId: 'q2', earned: 27, status: 'graded' },
  { studentId: 's1', itemId: 'q3', earned: 44, status: 'graded' },
  { studentId: 's1', itemId: 'p1', earned: 185, status: 'graded' },
  { studentId: 's1', itemId: 'p2', earned: 46, status: 'graded' },
  // Michael Chen - good student
  { studentId: 's2', itemId: 'a1', earned: 85, status: 'graded' },
  { studentId: 's2', itemId: 'a2', earned: 78, status: 'graded' },
  { studentId: 's2', itemId: 'a3', earned: 40, status: 'graded' },
  { studentId: 's2', itemId: 'q1', earned: 25, status: 'graded' },
  { studentId: 's2', itemId: 'q2', earned: 22, status: 'graded' },
  { studentId: 's2', itemId: 'q3', earned: 38, status: 'graded' },
  { studentId: 's2', itemId: 'p1', earned: null, status: 'submitted' },
  { studentId: 's2', itemId: 'p2', earned: 42, status: 'graded' },
  // Emma Wilson - average student
  { studentId: 's3', itemId: 'a1', earned: 75, status: 'graded' },
  { studentId: 's3', itemId: 'a2', earned: 70, status: 'graded' },
  { studentId: 's3', itemId: 'a3', earned: 35, status: 'graded' },
  { studentId: 's3', itemId: 'q1', earned: 22, status: 'graded' },
  { studentId: 's3', itemId: 'q2', earned: 20, status: 'graded' },
  { studentId: 's3', itemId: 'q3', earned: 35, status: 'graded' },
  { studentId: 's3', itemId: 'p1', earned: null, status: 'pending' },
  { studentId: 's3', itemId: 'p2', earned: 38, status: 'graded' },
  // David Johnson - struggling
  { studentId: 's4', itemId: 'a1', earned: 62, status: 'graded' },
  { studentId: 's4', itemId: 'a2', earned: 58, status: 'graded' },
  { studentId: 's4', itemId: 'a3', earned: null, status: 'missing' },
  { studentId: 's4', itemId: 'q1', earned: 18, status: 'graded' },
  { studentId: 's4', itemId: 'q2', earned: 15, status: 'graded' },
  { studentId: 's4', itemId: 'q3', earned: 28, status: 'graded' },
  { studentId: 's4', itemId: 'p1', earned: null, status: 'pending' },
  { studentId: 's4', itemId: 'p2', earned: null, status: 'submitted' },
  // Sarah Brown - top student
  { studentId: 's5', itemId: 'a1', earned: 98, status: 'graded' },
  { studentId: 's5', itemId: 'a2', earned: 95, status: 'graded' },
  { studentId: 's5', itemId: 'a3', earned: 48, status: 'graded' },
  { studentId: 's5', itemId: 'q1', earned: 30, status: 'graded' },
  { studentId: 's5', itemId: 'q2', earned: 29, status: 'graded' },
  { studentId: 's5', itemId: 'q3', earned: 47, status: 'graded' },
  { studentId: 's5', itemId: 'p1', earned: 195, status: 'graded' },
  { studentId: 's5', itemId: 'p2', earned: 49, status: 'graded' },
  // James Taylor
  { studentId: 's6', itemId: 'a1', earned: 80, status: 'graded' },
  { studentId: 's6', itemId: 'a2', earned: 82, status: 'graded' },
  { studentId: 's6', itemId: 'a3', earned: 38, status: 'graded' },
  { studentId: 's6', itemId: 'q1', earned: 24, status: 'graded' },
  { studentId: 's6', itemId: 'q2', earned: 26, status: 'graded' },
  { studentId: 's6', itemId: 'q3', earned: 40, status: 'graded' },
  { studentId: 's6', itemId: 'p1', earned: null, status: 'pending' },
  { studentId: 's6', itemId: 'p2', earned: 40, status: 'graded' },
  // Olivia Davis
  { studentId: 's7', itemId: 'a1', earned: 88, status: 'graded' },
  { studentId: 's7', itemId: 'a2', earned: 85, status: 'graded' },
  { studentId: 's7', itemId: 'a3', earned: 42, status: 'graded' },
  { studentId: 's7', itemId: 'q1', earned: 26, status: 'graded' },
  { studentId: 's7', itemId: 'q2', earned: 24, status: 'graded' },
  { studentId: 's7', itemId: 'q3', earned: 42, status: 'graded' },
  { studentId: 's7', itemId: 'p1', earned: 170, status: 'graded' },
  { studentId: 's7', itemId: 'p2', earned: 44, status: 'graded' },
  // Daniel Martinez
  { studentId: 's8', itemId: 'a1', earned: 72, status: 'graded' },
  { studentId: 's8', itemId: 'a2', earned: 68, status: 'graded' },
  { studentId: 's8', itemId: 'a3', earned: 30, status: 'graded' },
  { studentId: 's8', itemId: 'q1', earned: 20, status: 'graded' },
  { studentId: 's8', itemId: 'q2', earned: 18, status: 'graded' },
  { studentId: 's8', itemId: 'q3', earned: 32, status: 'graded' },
  { studentId: 's8', itemId: 'p1', earned: null, status: 'pending' },
  { studentId: 's8', itemId: 'p2', earned: 35, status: 'graded' },
  // Sophia Anderson
  { studentId: 's9', itemId: 'a1', earned: 90, status: 'graded' },
  { studentId: 's9', itemId: 'a2', earned: 92, status: 'graded' },
  { studentId: 's9', itemId: 'a3', earned: 46, status: 'graded' },
  { studentId: 's9', itemId: 'q1', earned: 27, status: 'graded' },
  { studentId: 's9', itemId: 'q2', earned: 28, status: 'graded' },
  { studentId: 's9', itemId: 'q3', earned: 45, status: 'graded' },
  { studentId: 's9', itemId: 'p1', earned: 180, status: 'graded' },
  { studentId: 's9', itemId: 'p2', earned: 47, status: 'graded' },
  // Liam Thomas
  { studentId: 's10', itemId: 'a1', earned: 65, status: 'graded' },
  { studentId: 's10', itemId: 'a2', earned: 60, status: 'graded' },
  { studentId: 's10', itemId: 'a3', earned: 28, status: 'graded' },
  { studentId: 's10', itemId: 'q1', earned: 19, status: 'graded' },
  { studentId: 's10', itemId: 'q2', earned: 16, status: 'graded' },
  { studentId: 's10', itemId: 'q3', earned: 30, status: 'graded' },
  { studentId: 's10', itemId: 'p1', earned: null, status: 'submitted' },
  { studentId: 's10', itemId: 'p2', earned: 32, status: 'graded' },
];

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

  // Filter students by search
  const filteredStudents = useMemo(
    () =>
      sampleStudents.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery],
  );

  // Compute summary stats
  const summaryStats = useMemo(() => {
    const studentFinalGrades = sampleStudents.map((student) => {
      const studentGrades = sampleGrades.filter((g) => g.studentId === student.id && g.earned !== null);
      const categoryGrades = gradingConfig.categories.map((cat) => {
        const catItems = sampleItems.filter((i) => i.categoryId === cat.id);
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

    const classAverage = studentFinalGrades.reduce((s, g) => s + g, 0) / studentFinalGrades.length;
    const pendingCount = sampleGrades.filter((g) => g.status === 'submitted' || g.status === 'pending').length;

    return {
      classAverage,
      gradedItemCount: sampleItems.length,
      totalStudents: sampleStudents.length,
      pendingGradingCount: pendingCount,
    };
  }, [gradingConfig]);

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

    sampleStudents.forEach((student) => {
      const studentGrades = sampleGrades.filter((g) => g.studentId === student.id && g.earned !== null);
      const categoryGrades = gradingConfig.categories.map((cat) => {
        const catItems = sampleItems.filter((i) => i.categoryId === cat.id);
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
  }, [gradingConfig]);

  // Detail panel data
  const detailStudent = detailStudentId ? sampleStudents.find((s) => s.id === detailStudentId) ?? null : null;
  const detailGrades = detailStudentId
    ? sampleGrades
        .filter((g) => g.studentId === detailStudentId)
        .map((g) => ({
          itemId: g.itemId,
          earned: g.earned,
          possible: sampleItems.find((i) => i.id === g.itemId)?.maxScore ?? 0,
          status: g.status,
        }))
    : [];
  const detailFinalGrade = useMemo(() => {
    if (!detailStudentId) return 0;
    const studentGrades = sampleGrades.filter((g) => g.studentId === detailStudentId && g.earned !== null);
    const categoryGrades = gradingConfig.categories.map((cat) => {
      const catItems = sampleItems.filter((i) => i.categoryId === cat.id);
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
  }, [detailStudentId, gradingConfig]);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <CssBaseline />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <GradebookTopBar
        courseName="Advanced React Patterns"
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
              gradedItems={sampleItems}
              grades={sampleGrades}
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
        gradedItems={sampleItems}
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
