import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Skeleton,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { useOrgAdminMembers } from '../../hooks/useOrgAdmin';
import { getRoleDisplayName, formatDate } from '../../utils/userHelpers';
import type { ManagerMemberItem } from '../../services/organization.services';
import type { UserRole } from '../../types/types';

const RecentMembersTable: React.FC = () => {
  const navigate = useNavigate();
  const { data: membersData, isLoading } = useOrgAdminMembers({ page_size: 5 });
  const members: ManagerMemberItem[] = membersData?.results ?? [];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '1rem',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Recent Members
        </Typography>
        <Button
          size="small"
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          onClick={() => navigate('/org-admin/members')}
          sx={{ textTransform: 'none', fontWeight: 600, color: 'primary.dark' }}
        >
          View all
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ p: 2 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Skeleton variant="text" width={120} height={24} />
              <Skeleton variant="text" width={180} height={24} />
              <Skeleton variant="text" width={80} height={24} />
              <Skeleton variant="text" width={60} height={24} />
              <Skeleton variant="text" width={80} height={24} />
            </Box>
          ))}
        </Box>
      ) : members.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No members yet.
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/org-admin/invite')}
            sx={{ mt: 2, textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
          >
            Add Member
          </Button>
        </Box>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  '& th': {
                    fontWeight: 600,
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  },
                }}
              >
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontWeight: 500 }}>{member.name}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{member.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleDisplayName(member.role as UserRole)}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        bgcolor: 'rgba(255,164,36,0.08)',
                        color: 'primary.dark',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={member.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={member.is_active ? 'success' : 'default'}
                      variant="outlined"
                      sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                    {formatDate(member.date_joined)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default RecentMembersTable;