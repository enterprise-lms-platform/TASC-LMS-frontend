import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import {
  Description as SubmissionIcon,
  AttachFile as FilesIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

type TabValue = 'submission' | 'files' | 'history';

interface SubmissionTabsProps {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

const SubmissionTabs: React.FC<SubmissionTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Box sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider', px: 3 }}>
      <Tabs
        value={activeTab}
        onChange={(_, v) => onTabChange(v)}
        sx={{
          minHeight: 48,
          '& .MuiTab-root': {
            minHeight: 48,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            gap: 1,
          },
        }}
      >
        <Tab
          value="submission"
          icon={<SubmissionIcon sx={{ fontSize: 18 }} />}
          iconPosition="start"
          label="Submission"
        />
        <Tab
          value="files"
          icon={<FilesIcon sx={{ fontSize: 18 }} />}
          iconPosition="start"
          label="Files"
        />
        <Tab
          value="history"
          icon={<HistoryIcon sx={{ fontSize: 18 }} />}
          iconPosition="start"
          label="History"
        />
      </Tabs>
    </Box>
  );
};

export default SubmissionTabs;
export type { TabValue };
