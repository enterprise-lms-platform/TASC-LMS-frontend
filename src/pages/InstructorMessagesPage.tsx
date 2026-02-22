import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  AppBar,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  Divider,
  Badge,
  Chip,
} from '@mui/material';
import {
  Chat as MessagesIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
  Circle as OnlineIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

interface Conversation {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  course: string;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

const conversations: Conversation[] = [
  { id: '1', name: 'Sarah Chen', initials: 'SC', lastMessage: 'Thank you for the feedback on my assignment!', time: '5 min ago', unread: 2, online: true, course: 'Advanced React' },
  { id: '2', name: 'James Wilson', initials: 'JW', lastMessage: 'Can we schedule a 1-on-1 session?', time: '30 min ago', unread: 1, online: true, course: 'TypeScript Mastery' },
  { id: '3', name: 'Maria Garcia', initials: 'MG', lastMessage: 'I have a question about Module 3', time: '2 hours ago', unread: 0, online: false, course: 'Advanced React' },
  { id: '4', name: 'Alex Kim', initials: 'AK', lastMessage: 'Will the deadline be extended?', time: '5 hours ago', unread: 0, online: false, course: 'Node.js Backend' },
  { id: '5', name: 'Priya Patel', initials: 'PP', lastMessage: 'My project submission is ready for review', time: '1 day ago', unread: 0, online: true, course: 'Advanced React' },
  { id: '6', name: 'Tom Brown', initials: 'TB', lastMessage: 'Thanks for the extra resources!', time: '2 days ago', unread: 0, online: false, course: 'GraphQL' },
];

const sampleMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', sender: 'them', text: 'Hi Professor! I just submitted my Custom Hooks assignment.', time: '10:30 AM' },
    { id: 'm2', sender: 'me', text: 'Great job, Sarah! I\'ve reviewed it. Your implementation of useDebounce is particularly clean.', time: '10:45 AM' },
    { id: 'm3', sender: 'me', text: 'One suggestion: consider adding error boundaries to your useAsync hook.', time: '10:46 AM' },
    { id: 'm4', sender: 'them', text: 'That\'s a great idea! I\'ll update it today.', time: '11:00 AM' },
    { id: 'm5', sender: 'them', text: 'Thank you for the feedback on my assignment!', time: '11:02 AM' },
  ],
};

const InstructorMessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedConvo, setSelectedConvo] = useState<string>('1');
  const [newMessage, setNewMessage] = useState('');

  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.course.toLowerCase().includes(search.toLowerCase())
  );

  const activeConvo = conversations.find((c) => c.id === selectedConvo);
  const messages = sampleMessages[selectedConvo] || [];

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setNewMessage('');
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` }, bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/instructor')} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}>
            Back
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MessagesIcon sx={{ color: 'primary.main' }} />
              Messages
              <Chip size="small" label={conversations.reduce((s, c) => s + c.unread, 0)} sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'error.main', color: 'white' }} />
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ display: 'flex', height: 'calc(100vh - 72px)' }}>
          {/* Conversations List */}
          <Paper
            elevation={0}
            sx={{ width: 340, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', borderRadius: 0 }}
          >
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
              />
            </Box>
            <Divider />
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {filtered.map((convo) => (
                <Box
                  key={convo.id}
                  onClick={() => setSelectedConvo(convo.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 2,
                    cursor: 'pointer',
                    bgcolor: selectedConvo === convo.id ? 'rgba(255,164,36,0.08)' : 'transparent',
                    borderLeft: selectedConvo === convo.id ? 3 : 0,
                    borderColor: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                    transition: 'all 0.15s',
                  }}
                >
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={convo.online ? <OnlineIcon sx={{ fontSize: 10, color: '#10b981' }} /> : null}
                  >
                    <Avatar sx={{ width: 40, height: 40, fontSize: '0.8rem', bgcolor: 'primary.main' }}>{convo.initials}</Avatar>
                  </Badge>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={convo.unread > 0 ? 700 : 500} noWrap>{convo.name}</Typography>
                      <Typography variant="caption" color="text.disabled">{convo.time}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" noWrap>{convo.lastMessage}</Typography>
                    <Typography variant="caption" color="text.disabled">{convo.course}</Typography>
                  </Box>
                  {convo.unread > 0 && (
                    <Chip label={convo.unread} size="small" sx={{ height: 20, minWidth: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'primary.main', color: 'white' }} />
                  )}
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Chat Area */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
            {/* Chat Header */}
            {activeConvo && (
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 36, height: 36, fontSize: '0.8rem', bgcolor: 'primary.main' }}>{activeConvo.initials}</Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={700}>{activeConvo.name}</Typography>
                  <Typography variant="caption" color={activeConvo.online ? '#10b981' : 'text.disabled'}>
                    {activeConvo.online ? 'Online' : 'Offline'}
                  </Typography>
                </Box>
                <Chip label={activeConvo.course} size="small" sx={{ ml: 'auto', height: 22, fontSize: '0.7rem', bgcolor: 'grey.100' }} />
              </Box>
            )}

            {/* Messages */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 1.5,
                      px: 2,
                      borderRadius: 2,
                      bgcolor: msg.sender === 'me' ? 'primary.main' : 'grey.100',
                      color: msg.sender === 'me' ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', textAlign: 'right', mt: 0.5 }}>
                      {msg.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Input */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton size="small"><AttachIcon /></IconButton>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <IconButton onClick={handleSend} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                <SendIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorMessagesPage;
