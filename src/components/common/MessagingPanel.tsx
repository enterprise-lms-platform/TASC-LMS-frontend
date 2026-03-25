import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Send as SendIcon,
  AttachFile as AttachIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagingApi } from '../../services/messaging.services';
import type { ConversationResponse, MessageResponse } from '../../services/messaging.services';
import { useAuth } from '../../contexts/AuthContext';

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const getOtherParticipantName = (convo: ConversationResponse, myId: number): string => {
  const other = convo.participants_details.find(p => p.id !== myId);
  return other?.name || 'Unknown';
};

/** Hook to get total unread conversation count (for sidebar badges) */
export const useUnreadMessageCount = () => {
  const { data } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagingApi.getAll({ page_size: 100 }).then(r => {
      const data = r.data;
      return Array.isArray(data) ? data : data?.results ?? [];
    }),
    refetchInterval: 30000,
  });
  return (data ?? []).reduce((s: number, c: ConversationResponse) => s + c.unread_count, 0);
};

interface MessagingPanelProps {
  height?: string;
}

const MessagingPanel: React.FC<MessagingPanelProps> = ({ height = 'calc(100vh - 72px)' }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const myId = user?.id ?? 0;
  const [search, setSearch] = useState('');
  const [selectedConvoId, setSelectedConvoId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: convosData, isLoading: convosLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagingApi.getAll({ page_size: 100 }).then(r => {
      const data = r.data;
      return Array.isArray(data) ? data : data?.results ?? [];
    }),
    refetchInterval: 15000,
  });

  const conversations = convosData ?? [];

  useEffect(() => {
    if (selectedConvoId === null && conversations.length > 0) {
      setSelectedConvoId(conversations[0].id);
    }
  }, [conversations, selectedConvoId]);

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedConvoId],
    queryFn: () => messagingApi.getMessages(selectedConvoId!, { page_size: 200 }).then(r => {
      const data = r.data;
      return Array.isArray(data) ? data : data?.results ?? [];
    }),
    enabled: selectedConvoId !== null,
    refetchInterval: 5000,
  });

  const messages: MessageResponse[] = messagesData ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    if (selectedConvoId !== null) {
      const convo = conversations.find(c => c.id === selectedConvoId);
      if (convo && convo.unread_count > 0) {
        messagingApi.markAsRead(selectedConvoId).then(() => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        });
      }
    }
  }, [selectedConvoId, conversations, queryClient]);

  const sendMutation = useMutation({
    mutationFn: (content: string) => messagingApi.sendMessage(selectedConvoId!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConvoId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const handleSend = () => {
    const text = newMessage.trim();
    if (!text || selectedConvoId === null) return;
    setNewMessage('');
    sendMutation.mutate(text);
  };

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const otherName = getOtherParticipantName(c, myId).toLowerCase();
    const lastMsg = c.last_message?.content?.toLowerCase() ?? '';
    return otherName.includes(q) || lastMsg.includes(q);
  });

  const activeConvo = conversations.find(c => c.id === selectedConvoId);
  const activeConvoName = activeConvo ? getOtherParticipantName(activeConvo, myId) : '';

  return (
    <Box sx={{ display: 'flex', height }}>
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
          {convosLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.5, p: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="80%" height={16} />
                </Box>
              </Box>
            ))
          ) : filtered.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {search ? 'No conversations match your search' : 'No conversations yet'}
              </Typography>
            </Box>
          ) : (
            filtered.map((convo) => {
              const name = getOtherParticipantName(convo, myId);
              const initials = getInitials(name);
              const lastMsg = convo.last_message?.content ?? '';
              const time = convo.updated_at ? formatTime(convo.updated_at) : '';

              return (
                <Box
                  key={convo.id}
                  onClick={() => setSelectedConvoId(convo.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 2,
                    cursor: 'pointer',
                    bgcolor: selectedConvoId === convo.id ? 'rgba(255,164,36,0.08)' : 'transparent',
                    borderLeft: selectedConvoId === convo.id ? 3 : 0,
                    borderColor: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                    transition: 'all 0.15s',
                  }}
                >
                  <Avatar sx={{ width: 40, height: 40, fontSize: '0.8rem', bgcolor: 'primary.main' }}>{initials}</Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={convo.unread_count > 0 ? 700 : 500} noWrap>{name}</Typography>
                      <Typography variant="caption" color="text.disabled">{time}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" noWrap>{lastMsg}</Typography>
                  </Box>
                  {convo.unread_count > 0 && (
                    <Chip label={convo.unread_count} size="small" sx={{ height: 20, minWidth: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: 'primary.main', color: 'white' }} />
                  )}
                </Box>
              );
            })
          )}
        </Box>
      </Paper>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
        {activeConvo && (
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, fontSize: '0.8rem', bgcolor: 'primary.main' }}>
              {getInitials(activeConvoName)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={700}>{activeConvoName}</Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ flex: 1, overflow: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {messagesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : messages.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
              <Typography variant="body2" color="text.secondary">No messages yet. Start the conversation!</Typography>
            </Box>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === myId;
              return (
                <Box key={msg.id} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                  <Box
                    sx={{
                      maxWidth: '70%',
                      p: 1.5,
                      px: 2,
                      borderRadius: 2,
                      bgcolor: isMe ? 'primary.main' : 'grey.100',
                      color: isMe ? 'white' : 'text.primary',
                    }}
                  >
                    <Typography variant="body2">{msg.content}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', textAlign: 'right', mt: 0.5 }}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </Box>

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton size="small"><AttachIcon /></IconButton>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            disabled={selectedConvoId === null}
          />
          <IconButton
            onClick={handleSend}
            disabled={!newMessage.trim() || sendMutation.isPending}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, '&.Mui-disabled': { bgcolor: 'grey.300', color: 'grey.500' } }}
          >
            <SendIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default MessagingPanel;
