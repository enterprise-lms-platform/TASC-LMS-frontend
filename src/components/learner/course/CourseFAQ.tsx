import React, { useState } from 'react';
import { Box, Typography, Stack, Collapse, IconButton } from '@mui/material';
import { ExpandMore as ExpandIcon, ChevronRight as ChevronIcon } from '@mui/icons-material';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface CourseFAQProps {
  faqs: FAQItem[];
}

const CourseFAQ: React.FC<CourseFAQProps> = ({ faqs }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 3,
        p: 4,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e4e4e7',
      }}
    >
      <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ mb: 3 }}>
        Frequently Asked Questions
      </Typography>

      <Stack spacing={1.5}>
        {faqs.map((faq) => {
          const isExpanded = expandedItems.includes(faq.id);

          return (
            <Box
              key={faq.id}
              sx={{
                border: '1px solid #e4e4e7',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box
                onClick={() => toggleItem(faq.id)}
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: '#fafafa' },
                }}
              >
                <Typography fontWeight={600} color="text.primary">
                  {faq.question}
                </Typography>
                <IconButton size="small">
                  {isExpanded ? (
                    <ExpandIcon sx={{ color: '#ffa424' }} />
                  ) : (
                    <ChevronIcon />
                  )}
                </IconButton>
              </Box>
              <Collapse in={isExpanded}>
                <Box sx={{ p: 2, pt: 0, borderTop: '1px solid #e4e4e7' }}>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {faq.answer}
                  </Typography>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default CourseFAQ;
