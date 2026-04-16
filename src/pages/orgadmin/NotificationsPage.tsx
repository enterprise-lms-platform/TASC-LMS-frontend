import React, { useState, useMemo } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Button,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  Notifications as NotifIcon,
  MarkEmailRead as MarkReadIcon,
  CheckCircle as ApprovalIcon,
  Person as RegistrationIcon,
  Settings as SystemIcon,
  EmojiEvents as MilestoneIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgNotifications, useMarkAllNotificationsRead } from '../../hooks/useOrgAdmin';
import type { Notification } from '../../services/notifications.services';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const typeColors: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  approval: { bg: '#dcfce7', color: '#10b981', icon: <ApprovalIcon /> },
  registration: { bg: 'rgba(99,102,241,0.08)', color: '#6366f1', icon: <RegistrationIcon /> },
  system: { bg: '#fff3e0', color: '#f59e0b', icon: <SystemIcon /> },
  milestone: { bg: 'rgba(255,164,36,0.08)', color: '#ffa424', icon: <MilestoneIcon /> },
};

const formatType = (type: string) => {
  const map: Record<string, string> = { approval: 'Approval', registration: 'Registration', system: 'System', milestone: 'Milestone' };
  return map[type] || type;
};

const NotificationsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState<string>('All');

  const { data: notificationsData, isLoading } = useOrgNotifications({ page_size: 20 });
  const markAllRead = useMarkAllNotificationsRead();

  const allNotifs: Notification[] = notificationsData?.results ?? [];

  const filterOptions = useMemo(() => [
    { label: 'All', count: allNotifs.length },
    { label: 'Unread', count: allNotifs.filter(n => !n.is_read).length },
    { label: 'Approvals', count: allNotifs.filter(n => n.type === 'approval').length },
    { label: 'System', count: allNotifs.filter(n => n.type === 'system').length },
  ], [allNotifs]);

  const filtered = useMemo(() => {
    if (filter === 'All') return allNotifs;
    if (filter === 'Unread') return allNotifs.filter(n => !n.is_read);
    if (filter === 'Approvals') return allNotifs.filter(n => n.type === 'approval');
    if (filter === 'System') return allNotifs.filter(n => n.type === 'system');
    return allNotifs;
  }, [allNotifs, filter]);

  const handleMarkAllRead = () => markAllRead.mutate();

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  const unreadCount = allNotifs.filter(n => !n.is_read).length;

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Notifications" />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #ffa424, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <NotifIcon />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>Notifications</Typography>
                <Typography variant="body2" color="text.secondary">Stay updated on organization activity</Typography>
              </Box>
            </Box>
            {unreadCount > 0 && (
              <Button startIcon={<MarkReadIcon />} onClick={handleMarkAllRead}
                sx={{ textTransform: 'none', fontWeight: 600, color: '#ffa424', '&:hover': { bgcolor: 'rgba(255,164,36,0.08)' } }}>
                Mark All as Read
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {filterOptions.map(opt => (
              <Chip key={opt.label} label={`${opt.label} (${opt.count})`} onClick={() => setFilter(opt.label)}
                sx={{ fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', bgcolor: filter === opt.label ? 'rgba(255,164,36,0.12)' : 'white', color: filter === opt.label ? '#b45309' : 'text.secondary', border: '1px solid', borderColor: filter === opt.label ? '#ffa424' : 'divider', '&:hover': { bgcolor: filter === opt.label ? 'rgba(255,164,36,0.15)' : 'grey.50' } }} />
            ))}
          </Box>

          <Paper elevation={0} sx={cardSx}>
            {isLoading ? (
              <Box sx={{ p: 2 }}>{[0,1,2,3,4].map(i => <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, p: 1 }}><Skeleton variant="rounded" width={40} height={40} /><Box sx={{ flex: 1 }}><Skeleton width="60%" /><Skeleton width="30%" /></Box></Box>)}</Box>
            ) : filtered.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}><NotifIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} /><Typography variant="body1" fontWeight={600} color="text.secondary">You're all caught up!</Typography></Box>
            ) : (
              filtered.map((notif, i) => {
                const colors = typeColors[notif.type] || typeColors.system;
                return (
                  <Box key={notif.id} sx={{ display: 'flex', gap: 2, p: 2, px: 3, borderBottom: i < filtered.length - 1 ? 1 : 0, borderColor: 'divider', bgcolor: notif.is_read ? 'transparent' : 'rgba(255,164,36,0.02)', position: 'relative', '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' } }}>
                    {!notif.is_read && <Box sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 8, height: 8, borderRadius: '50%', bgcolor: '#3b82f6' }} />}
                    <Box sx={{ width: 40, height: 40, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: colors.bg, color: colors.color, flexShrink: 0 }}>{colors.icon}</Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                        <Typography variant="body2" fontWeight={notif.is_read ? 500 : 600}>{notif.title}</Typography>
                        <Chip label={formatType(notif.type)} size="small" sx={{ height: 20, fontWeight: 600, fontSize: '0.65rem', bgcolor: colors.bg, color: colors.color }} />
                      </Box>
                      <Typography variant="caption" color="text.secondary">{notif.description}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.disabled" sx={{ whiteSpace: 'nowrap' }}>{formatTime(notif.created_at)}</Typography>
                  </Box>
                );
              })
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationsPage;