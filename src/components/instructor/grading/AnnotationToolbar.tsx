import React from 'react';
import { Box, IconButton } from '@mui/material';
import {
  FormatColorFill as HighlightIcon,
  Comment as CommentIcon,
  StrikethroughS as StrikeIcon,
  FormatUnderlined as UnderlineIcon,
} from '@mui/icons-material';

type AnnotationTool = 'highlight' | 'comment' | 'strike' | 'underline' | null;
type HighlightColor = 'yellow' | 'green' | 'red';

interface AnnotationToolbarProps {
  activeTool: AnnotationTool;
  activeColor: HighlightColor;
  onToolChange: (tool: AnnotationTool) => void;
  onColorChange: (color: HighlightColor) => void;
}

const colors: Array<{ key: HighlightColor; hex: string }> = [
  { key: 'yellow', hex: '#fef08a' },
  { key: 'green', hex: '#bbf7d0' },
  { key: 'red', hex: '#fecaca' },
];

const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({
  activeTool,
  activeColor,
  onToolChange,
  onColorChange,
}) => {
  const ToolButton = ({
    tool,
    icon,
  }: {
    tool: AnnotationTool;
    icon: React.ReactNode;
  }) => (
    <IconButton
      onClick={() => onToolChange(activeTool === tool ? null : tool)}
      sx={{
        width: 36,
        height: 36,
        border: 1,
        borderColor: activeTool === tool ? 'primary.main' : 'divider',
        bgcolor: activeTool === tool ? 'primary.main' : 'white',
        color: activeTool === tool ? 'white' : 'text.secondary',
        borderRadius: 1,
        '&:hover': { borderColor: 'primary.light', color: 'primary.main' },
      }}
    >
      {icon}
    </IconButton>
  );

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: 'white',
        borderBottom: 1,
        borderColor: 'divider',
        p: 1.5,
        px: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        zIndex: 10,
      }}
    >
      <ToolButton tool="highlight" icon={<HighlightIcon fontSize="small" />} />
      <ToolButton tool="comment" icon={<CommentIcon fontSize="small" />} />
      <ToolButton tool="strike" icon={<StrikeIcon fontSize="small" />} />
      <ToolButton tool="underline" icon={<UnderlineIcon fontSize="small" />} />

      {/* Separator */}
      <Box sx={{ width: 1, height: 24, bgcolor: 'divider', mx: 1 }} />

      {/* Colors */}
      {colors.map((c) => (
        <Box
          key={c.key}
          onClick={() => onColorChange(c.key)}
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: c.hex,
            cursor: 'pointer',
            border: 2,
            borderColor: 'white',
            boxShadow: activeColor === c.key ? `0 0 0 2px #ffa424` : `0 0 0 1px #d4d4d8`,
          }}
        />
      ))}
    </Box>
  );
};

export default AnnotationToolbar;
export type { AnnotationTool, HighlightColor };
