import { Box, Container, Typography, Paper, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faShieldAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafaf8', py: { xs: 3, md: 6 } }}>
      <Container maxWidth="md">
        <Button
          onClick={() => navigate(-1)}
          sx={{
            color: '#71717a',
            textTransform: 'none',
            fontSize: '0.875rem',
            mb: 3,
            '&:hover': { color: '#3f3f46', background: 'transparent' },
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} />
          Back
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '50%', bgcolor: 'rgba(255,164,36,0.1)', mb: 2 }}>
              <FontAwesomeIcon icon={faShieldAlt} style={{ fontSize: '1.5rem', color: '#ffa424' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Data Protection & Privacy Policy
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Document No: TASC/QHSE/PO/24 &middot; Version 1 &middot; Effective: March 2024
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Policy Statement */}
          <Section title="Policy Statement">
            <Typography variant="body1" sx={bodyStyle}>
              Q-Training Limited t/a The Assessment and Skilling Centre is committed to protecting the privacy and security of personal data entrusted to it. This Data Protection Policy outlines how personal data is collected, stored, used, and disclosed in accordance with the relevant data protection regulations of Uganda (The Data Protection and Privacy Act, 2019).
            </Typography>
          </Section>

          {/* Scope */}
          <Section title="Scope">
            <Typography variant="body1" sx={bodyStyle}>
              This Data Protection and Privacy Policy applies to all personal data that Q-Training/TASC collects during its operations. It outlines how personal data is collected, stored, used, and disclosed, adhering to the relevant data protection regulations, while prioritizing data security, respecting individual privacy rights, and ensuring data is only retained for as long as necessary for legitimate business purposes.
            </Typography>
          </Section>

          {/* What is Personal Data */}
          <Section title="What is Personal Data?">
            <Typography variant="body1" sx={bodyStyle}>
              Personal data is any information that relates to an identified or identifiable individual. This can include:
            </Typography>
            <BulletList items={[
              'Names',
              'Contact details (email address, phone number, physical address)',
              'Identification numbers (national ID, passport number)',
              'Employment information where applicable for training',
              'Education background',
              'Emergency/Next of Kin contact details',
            ]} />
          </Section>

          {/* Collection Channels */}
          <Section title="Personal Data Collection Channels">
            <Typography variant="body1" sx={bodyStyle}>
              Personal data is collected directly from individuals, through:
            </Typography>
            <List dense sx={{ pl: 2 }}>
              {[
                'Applications for trainings',
                'Evaluations/surveys from interested parties e.g. clients, suppliers, and trainees',
                'Social Media interactions through the company website and other social media networks that represent the company',
                'Workshop events and/or meetings interactions',
              ].map((item, i) => (
                <ListItem key={i} sx={{ py: 0.25, pl: 0 }}>
                  <ListItemText
                    primary={`${i + 1}. ${item}`}
                    primaryTypographyProps={{ fontSize: '0.95rem', color: 'text.secondary' }}
                  />
                </ListItem>
              ))}
            </List>
          </Section>

          {/* Data Usage */}
          <Section title="Personal Data Usage">
            <Typography variant="body1" sx={bodyStyle}>
              Personal data is used for legitimate business purposes only, such as:
            </Typography>
            <DefinitionList items={[
              { term: 'Training services', desc: 'To acquire trainee/learner details, education background, and employment history as required per training.' },
              { term: 'Compliance with legal and regulatory requirements', desc: 'Meeting tax, reporting, and other legal/regulatory obligations.' },
              { term: 'Client and vendor services', desc: 'Providing training, assessment, and certification services delivery.' },
              { term: 'Recruitment and employment purposes', desc: 'Evaluating employment applications as advertised/required by the company, and managing employee records.' },
              { term: 'Marketing and communication', desc: 'Sending relevant information about our services and events.' },
            ]} />
          </Section>

          {/* Lawful Basis */}
          <Section title="Lawful Basis for Processing Personal Data">
            <DefinitionList items={[
              { term: 'Consent', desc: 'Explicit consent is obtained for specific purposes, such as social media postings and marketing communications.' },
              { term: 'Contractual obligations', desc: 'Data is obtained as required, to fulfill contractual agreements with interested parties (e.g., projects/training contracts, employment contracts).' },
              { term: 'Legal obligations', desc: 'Personal data might be obtained/processed, as a requirement, to comply with laws and regulations.' },
              { term: 'Legitimate interests', desc: "Data might be used for the company's legitimate interests, such as improving its services or preventing fraud, provided the interests do not override the fundamental rights and freedom of interested parties." },
            ]} />
          </Section>

          {/* Data Storage */}
          <Section title="Data Storage and Security">
            <Typography variant="body1" sx={bodyStyle}>
              The company takes appropriate technical and organizational measures to protect personal data from unauthorized access, disclosure, alteration, or destruction. This includes secure data storage practices, access controls, and regular security assessments.
            </Typography>
          </Section>

          {/* Data Retention */}
          <Section title="Data Retention">
            <Typography variant="body1" sx={bodyStyle}>
              The company retains personal data for no longer than necessary for the purposes for which it was collected, considering legal and regulatory requirements. We have established data retention policies that define specific timeframes for deleting different types of personal data.
            </Typography>
          </Section>

          {/* Rights */}
          <Section title="Your Rights">
            <Typography variant="body1" sx={bodyStyle}>
              Under the relevant data protection regulations, you have certain rights regarding your personal data:
            </Typography>
            <DefinitionList items={[
              { term: 'Right to Access', desc: 'You have the right to request a copy of your personal data held by Q-Training/TASC.' },
              { term: 'Right to Rectification', desc: 'You have the right to request the correction of any inaccurate or incomplete personal data.' },
              { term: 'Right to Erasure', desc: 'You have the right to request the deletion of your personal data under certain circumstances.' },
              { term: 'Right to Restriction of Processing', desc: 'You have the right to restrict the processing of your personal data in certain situations.' },
              { term: 'Right to Object', desc: 'You have the right to object to the processing of your personal data for marketing purposes.' },
              { term: 'Right to Data Portability', desc: 'You have the right to request the transfer of your personal data to another controller in a structured, commonly used, and machine-readable format.' },
            ]} />
          </Section>

          {/* Contact */}
          <Section title="Exercising Your Rights">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, bgcolor: 'rgba(255,164,36,0.06)', borderRadius: 2, border: '1px solid rgba(255,164,36,0.15)' }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ color: '#ffa424' }} />
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '0.95rem' }}>
                Contact our Data Protection Office at{' '}
                <Box component="a" href="mailto:info@tasc.co.ug" sx={{ color: '#ffa424', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  info@tasc.co.ug
                </Box>
              </Typography>
            </Box>
          </Section>

          {/* Disclaimer */}
          <Section title="Disclaimer">
            <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
              This Data Protection Policy is for informational purposes only and should not be construed as legal advice. We recommend consulting with legal counsel for specific guidance on data protection compliance in Uganda.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic', mt: 1 }}>
              Reference: The Data Protection and Privacy Act, 2019
            </Typography>
          </Section>

          <Divider sx={{ my: 4 }} />

          {/* Footer */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic', mb: 2 }}>
              This policy will be reviewed annually and revised where necessary. Notification of any significant changes shall be posted on the company website.
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Micheal Musinguzi
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              General Manager
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

const bodyStyle = { color: 'text.secondary', fontSize: '0.95rem', lineHeight: 1.7 };

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 1.5, fontSize: '1.05rem' }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const BulletList = ({ items }: { items: string[] }) => (
  <List dense sx={{ pl: 2 }}>
    {items.map((item, i) => (
      <ListItem key={i} sx={{ py: 0.25, pl: 0, display: 'list-item', listStyleType: 'disc', ml: 2 }}>
        <ListItemText primary={item} primaryTypographyProps={{ fontSize: '0.95rem', color: 'text.secondary' }} />
      </ListItem>
    ))}
  </List>
);

const DefinitionList = ({ items }: { items: { term: string; desc: string }[] }) => (
  <List dense sx={{ pl: 1 }}>
    {items.map((item, i) => (
      <ListItem key={i} sx={{ py: 0.5, pl: 0, display: 'block' }}>
        <ListItemText
          primary={
            <>
              <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{item.term}: </Box>
              <Box component="span" sx={{ color: 'text.secondary' }}>{item.desc}</Box>
            </>
          }
          primaryTypographyProps={{ fontSize: '0.95rem', lineHeight: 1.6 }}
        />
      </ListItem>
    ))}
  </List>
);

export default PrivacyPolicyPage;
