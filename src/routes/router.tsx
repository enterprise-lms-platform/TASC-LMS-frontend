/**
 * Main Router Configuration — TASC LMS
 *
 * Route slices are defined in role-specific files:
 *   publicRoutes.tsx      — unauthenticated routes
 *   learnerRoutes.tsx     — /learner/** + checkout/invoice
 *   instructorRoutes.tsx  — /instructor/**
 *   managerRoutes.tsx     — /manager/**
 *   financeRoutes.tsx     — /finance/**
 *   superadminRoutes.tsx  — /superadmin/**
 *
 * This file only composes them and creates the browser router.
 *
 * Route Loader Strategy:
 * - Loaders pre-fetch data via TanStack Query ensureQueryData()
 * - useQueryClient passed via closure (queryClient arg to createAppRouter)
 * - Failed loaders redirect to appropriate fallback routes
 */

import { createBrowserRouter } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { publicRoutes }     from './publicRoutes';
import { learnerRoutes }    from './learnerRoutes';
import { instructorRoutes } from './instructorRoutes';
import { managerRoutes }    from './managerRoutes';
import { financeRoutes }    from './financeRoutes';
import { superadminRoutes } from './superadminRoutes';

export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    ...publicRoutes(queryClient),
    ...learnerRoutes(queryClient),
    ...instructorRoutes(queryClient),
    ...managerRoutes(queryClient),
    ...financeRoutes(queryClient),
    ...superadminRoutes(queryClient),
  ]);

export default createAppRouter;
