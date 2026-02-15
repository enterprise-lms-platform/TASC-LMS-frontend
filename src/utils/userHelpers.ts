import type { UserRole } from '../types/types';

/**
 * Maps backend role values to user-friendly display labels
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    tasc_admin: 'Platform Administrator',
    lms_manager: 'LMS Manager',
    instructor: 'Instructor',
    finance: 'Finance Manager',
    learner: 'Learner',
  };
  
  return roleMap[role] || role.replace('_', ' ');
};

/**
 * Gets user initials from their name
 */
export const getUserInitials = (firstName?: string, lastName?: string): string => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }
  return 'U';
};

/**
 * Gets user display name (first + last name or email)
 */
export const getUserDisplayName = (
  firstName?: string,
  lastName?: string,
  email?: string
): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  return email || 'User';
};
