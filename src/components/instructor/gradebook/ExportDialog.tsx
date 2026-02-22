import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
} from '@mui/material';
import { TableChart as CsvIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';

interface ExportOptions {
  format: 'csv' | 'pdf';
  includeGrades: boolean;
  includeCategoryTotals: boolean;
  includeFinalGrade: boolean;
  includeEmails: boolean;
}

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ open, onClose, onExport }) => {
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [includeGrades, setIncludeGrades] = useState(true);
  const [includeCategoryTotals, setIncludeCategoryTotals] = useState(true);
  const [includeFinalGrade, setIncludeFinalGrade] = useState(true);
  const [includeEmails, setIncludeEmails] = useState(false);

  const handleExport = () => {
    onExport({ format, includeGrades, includeCategoryTotals, includeFinalGrade, includeEmails });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Export Gradebook</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          Format
        </Typography>
        <ToggleButtonGroup
          value={format}
          exclusive
          onChange={(_, val) => val && setFormat(val)}
          sx={{ mb: 3, display: 'flex', gap: 1 }}
        >
          <ToggleButton
            value="csv"
            sx={{
              flex: 1,
              border: '2px solid',
              borderColor: format === 'csv' ? 'primary.main' : 'grey.200',
              borderRadius: '12px !important',
              '&.Mui-selected': { bgcolor: 'rgba(255, 164, 36, 0.08)', color: 'primary.main' },
            }}
          >
            <CsvIcon sx={{ mr: 1 }} /> CSV
          </ToggleButton>
          <ToggleButton
            value="pdf"
            sx={{
              flex: 1,
              border: '2px solid',
              borderColor: format === 'pdf' ? 'primary.main' : 'grey.200',
              borderRadius: '12px !important',
              '&.Mui-selected': { bgcolor: 'rgba(255, 164, 36, 0.08)', color: 'primary.main' },
            }}
          >
            <PdfIcon sx={{ mr: 1 }} /> PDF
          </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Include
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <FormControlLabel control={<Checkbox checked={includeGrades} onChange={(e) => setIncludeGrades(e.target.checked)} />} label="Individual grades" />
          <FormControlLabel control={<Checkbox checked={includeCategoryTotals} onChange={(e) => setIncludeCategoryTotals(e.target.checked)} />} label="Category totals" />
          <FormControlLabel control={<Checkbox checked={includeFinalGrade} onChange={(e) => setIncludeFinalGrade(e.target.checked)} />} label="Final grade" />
          <FormControlLabel control={<Checkbox checked={includeEmails} onChange={(e) => setIncludeEmails(e.target.checked)} />} label="Student emails" />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
        <Button variant="contained" onClick={handleExport}>Export</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;
export type { ExportOptions };
