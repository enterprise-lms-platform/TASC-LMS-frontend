import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { Folder as FolderIcon } from '@mui/icons-material';

interface QuestionBank {
  id: string;
  name: string;
  questionCount: number;
  iconBg: string;
  iconColor: string;
}

interface QuestionBankCardProps {
  banks: QuestionBank[];
  onSelectBank: (bankId: string) => void;
}

const QuestionBankCard: React.FC<QuestionBankCardProps> = ({ banks, onSelectBank }) => {
  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
      <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={700}>Question Bank</Typography>
        <Button size="small" sx={{ textTransform: 'none' }}>Browse All</Button>
      </Box>

      <Box sx={{ p: 2 }}>
        {banks.map((bank) => (
          <Box
            key={bank.id}
            onClick={() => onSelectBank(bank.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              border: 1,
              borderColor: 'grey.200',
              borderRadius: 1,
              mb: 1,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'rgba(255, 164, 36, 0.05)',
              },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                bgcolor: bank.iconBg,
                color: bank.iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FolderIcon fontSize="small" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={500}>{bank.name}</Typography>
              <Typography variant="caption" color="text.secondary">{bank.questionCount} questions</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default QuestionBankCard;
export type { QuestionBank };
