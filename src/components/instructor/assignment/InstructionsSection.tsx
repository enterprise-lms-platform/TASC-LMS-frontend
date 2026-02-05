import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Description as InstructionsIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatListBulleted as BulletIcon,
  FormatListNumbered as NumberedIcon,
  Link as LinkIcon,
  Code as CodeIcon,
  Image as ImageIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  FolderZip as ZipIcon,
  Title as HeadingIcon,
} from '@mui/icons-material';

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'zip' | 'image' | 'doc';
}

interface InstructionsSectionProps {
  instructions: string;
  onInstructionsChange: (value: string) => void;
  attachments: Attachment[];
  onRemoveAttachment: (id: string) => void;
  onUpload: () => void;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({
  instructions,
  onInstructionsChange,
  attachments,
  onRemoveAttachment,
  onUpload,
}) => {
  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <PdfIcon />;
      case 'zip':
        return <ZipIcon />;
      default:
        return <InstructionsIcon />;
    }
  };

  const getAttachmentColor = (type: string) => {
    switch (type) {
      case 'pdf':
        return { bg: 'error.light', color: 'error.main' };
      case 'zip':
        return { bg: 'info.light', color: 'info.main' };
      default:
        return { bg: 'grey.200', color: 'text.secondary' };
    }
  };

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InstructionsIcon sx={{ color: 'primary.main' }} />
          Instructions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Provide clear and detailed instructions for learners
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Rich Text Editor */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Assignment Instructions <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
            {/* Toolbar */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                p: 1,
                bgcolor: 'grey.50',
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <IconButton size="small" title="Bold"><BoldIcon fontSize="small" /></IconButton>
              <IconButton size="small" title="Italic"><ItalicIcon fontSize="small" /></IconButton>
              <IconButton size="small" title="Underline"><UnderlineIcon fontSize="small" /></IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <IconButton size="small" title="Heading"><HeadingIcon fontSize="small" /></IconButton>
              <IconButton size="small" title="Bullet List"><BulletIcon fontSize="small" /></IconButton>
              <IconButton size="small" title="Numbered List"><NumberedIcon fontSize="small" /></IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <IconButton size="small" title="Link"><LinkIcon fontSize="small" /></IconButton>
              <IconButton size="small" title="Code"><CodeIcon fontSize="small" /></IconButton>
              <IconButton size="small" title="Image"><ImageIcon fontSize="small" /></IconButton>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <IconButton size="small" title="Align Left"><AlignLeftIcon fontSize="small" /></IconButton>
              <IconButton size="small" title="Align Center"><AlignCenterIcon fontSize="small" /></IconButton>
              <IconButton size="small" title="Align Right"><AlignRightIcon fontSize="small" /></IconButton>
            </Box>

            {/* Editor Content */}
            <Box
              component="div"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onInstructionsChange(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: instructions }}
              sx={{
                minHeight: 200,
                p: 2,
                outline: 'none',
                '&:focus': { bgcolor: 'rgba(255, 164, 36, 0.02)' },
                '& h3': { fontSize: '1.1rem', fontWeight: 600, mt: 2, mb: 1 },
                '& p': { mb: 1 },
                '& ol, & ul': { pl: 3 },
                '& li': { mb: 0.5 },
              }}
            />
          </Box>
        </Box>

        {/* Attachments */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Attachments <Typography component="span" variant="caption" color="text.secondary">(Optional)</Typography>
          </Typography>
          
          {/* Upload Area */}
          <Box
            onClick={onUpload}
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'rgba(255, 164, 36, 0.05)',
              },
            }}
          >
            <UploadIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">
              <strong>Click to upload</strong> or drag and drop
            </Typography>
            <Typography variant="body2" color="text.disabled">
              PDF, DOC, Images, ZIP (max 50MB)
            </Typography>
          </Box>

          {/* Attachment List */}
          {attachments.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {attachments.map((att) => {
                const colors = getAttachmentColor(att.type);
                return (
                  <Box
                    key={att.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      bgcolor: 'grey.50',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: colors.bg,
                        color: colors.color,
                      }}
                    >
                      {getAttachmentIcon(att.type)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={500}>{att.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{att.size}</Typography>
                    </Box>
                    <IconButton size="small" onClick={() => onRemoveAttachment(att.id)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default InstructionsSection;
export type { Attachment };
