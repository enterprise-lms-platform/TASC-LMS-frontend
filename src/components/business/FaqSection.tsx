import React, { useState } from 'react';
import { Box, Container, Typography, Chip, Paper, Collapse, IconButton, Stack } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    question: 'How does the free trial work?',
    answer: 'Our 14-day free trial gives you full access to all Business plan features with up to 10 users. No credit card required to start. At the end of your trial, you can choose a plan that fits your team size, or we\'ll downgrade you to our free tier.',
  },
  {
    question: 'Can we upload our own training content?',
    answer: 'Yes! Business and Enterprise plans include the ability to upload your own videos, documents, SCORM packages, and HTML content. You can combine our expert-led courses with your proprietary materials to create a unified learning experience.',
  },
  {
    question: 'What integrations do you support?',
    answer: 'We integrate with popular tools including Slack, Microsoft Teams, Google Workspace, Okta, Azure AD, Workday, and more. Our REST API allows for custom integrations with your existing systems. Enterprise customers get access to dedicated integration support.',
  },
  {
    question: 'Is TASC LMS compliant with data protection regulations?',
    answer: 'Yes, we take data security seriously. TASC LMS is fully GDPR compliant and follows industry best practices for data protection. We offer data residency options, encryption at rest and in transit, and comprehensive audit logs. We can provide our SOC 2 Type II report upon request.',
  },
  {
    question: 'How do you handle user provisioning?',
    answer: 'We support multiple provisioning methods: manual entry, CSV bulk import, SSO just-in-time provisioning, and SCIM automated provisioning (Enterprise plan). This makes it easy to add users from your existing HR systems or identity providers.',
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'Team plan includes email support with 24-hour response time. Business plan adds priority support with 4-hour response and live chat. Enterprise customers get a dedicated Customer Success Manager, phone support, and SLA guarantees. All customers have access to our comprehensive help center and documentation.',
  },
];

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fafafa' }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Chip icon={<HelpOutlineIcon sx={{ fontSize: 16 }} />} label="FAQ" sx={{ bgcolor: '#fff3e0', color: '#ffa424', fontWeight: 600, mb: 2, '& .MuiChip-icon': { color: '#ffa424' } }} />
          <Typography variant="h2" sx={{ fontWeight: 700, color: '#18181b', mb: 2, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            Frequently Asked Questions
          </Typography>
          <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, color: '#52525b' }}>
            Find answers to common questions about TASC LMS for Business.
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ border: '1px solid #e4e4e7', borderRadius: 3, overflow: 'hidden' }}>
          {faqs.map((faq, index) => (
            <Box key={faq.question} sx={{ borderBottom: index < faqs.length - 1 ? '1px solid #e4e4e7' : 'none' }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                sx={{ p: 3, cursor: 'pointer', transition: 'background 0.2s', '&:hover': { bgcolor: '#fafafa' } }}
              >
                <Typography sx={{ fontWeight: 600, color: '#27272a', pr: 2 }}>{faq.question}</Typography>
                <IconButton
                  size="small"
                  className={`faq-toggle ${openIndex === index ? 'open' : ''}`}
                  sx={{ bgcolor: openIndex === index ? '#ffa424' : '#f4f4f5', color: openIndex === index ? 'white' : '#71717a', flexShrink: 0 }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Stack>
              <Collapse in={openIndex === index}>
                <Typography sx={{ px: 3, pb: 3, color: '#52525b', lineHeight: 1.8 }}>{faq.answer}</Typography>
              </Collapse>
            </Box>
          ))}
        </Paper>
      </Container>
    </Box>
  );
};

export default FaqSection;
