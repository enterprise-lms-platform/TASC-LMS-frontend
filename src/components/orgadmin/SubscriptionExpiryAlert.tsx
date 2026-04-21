import React from 'react';
import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import { Warning as WarningIcon, Renew as RenewIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMySubscription } from '../../hooks/usePayments';

const SubscriptionExpiryAlert: React.FC = () => {
    const { data: sub } = useMySubscription();
    const navigate = useNavigate();

    if (!sub || !sub.has_active_subscription) return null;

    const isExpiringSoon = sub.days_remaining !== undefined && sub.days_remaining !== null && sub.days_remaining <= 30;
    const isInGrace = sub.in_grace_period;
    const isExpired = sub.status === 'expired' || (!sub.has_active_subscription);

    if (!isExpiringSoon && !isInGrace && !isExpired) return null;

    const getAlertConfig = () => {
        if (isInGrace) {
            return {
                bgcolor: 'rgba(239,68,68,0.08)',
                borderColor: '#ef4444',
                title: 'Subscription in Grace Period',
                description: `Your subscription has expired. You have ${sub.grace_days_remaining ?? 0} grace days remaining before access is revoked.`,
                chipColor: '#ef4444' as const,
                chipLabel: 'Grace Period',
            };
        }
        if (isExpired) {
            return {
                bgcolor: 'rgba(239,68,68,0.08)',
                borderColor: '#ef4444',
                title: 'Subscription Expired',
                description: 'Your organization subscription has expired. Learner access has been revoked.',
                chipColor: '#ef4444' as const,
                chipLabel: 'Expired',
            };
        }
        return {
            bgcolor: 'rgba(245,158,11,0.08)',
            borderColor: '#f59e0b',
            title: 'Subscription Expiring Soon',
            description: `Your subscription expires in ${sub.days_remaining} days. Renew now to avoid interruption.`,
            chipColor: '#f59e0b' as const,
            chipLabel: `${sub.days_remaining} days left`,
        };
    };

    const config = getAlertConfig();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: '1rem',
                bgcolor: config.bgcolor,
                border: '1px solid',
                borderColor: config.borderColor,
                mb: 3,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <WarningIcon sx={{ color: config.borderColor, mt: 0.25 }} />
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight={700}>{config.title}</Typography>
                        <Chip
                            label={config.chipLabel}
                            size="small"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                bgcolor: `${config.chipColor}20`,
                                color: config.chipColor,
                                height: 22,
                            }}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {config.description}
                    </Typography>
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<RenewIcon />}
                        onClick={() => navigate('/org-admin/billing')}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: 2,
                            boxShadow: 'none',
                        }}
                    >
                        Renew Subscription
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default SubscriptionExpiryAlert;
