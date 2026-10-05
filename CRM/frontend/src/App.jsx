import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleRoute, GuestRoute } from './guards/RouteGuards';
import Spinner from './components/ui/Spinner';

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterManagerPage = lazy(() => import('./pages/auth/RegisterManagerPage'));
const RegisterEmployeePage = lazy(() => import('./pages/auth/RegisterEmployeePage'));
const RegisterClientPage = lazy(() => import('./pages/auth/RegisterClientPage'));
const InvitationAcceptPage = lazy(() => import('./pages/auth/InvitationAcceptPage'));
const ProfilePhotoUploadPage = lazy(() => import('./pages/auth/ProfilePhotoUploadPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const RegistrationRequestsPage = lazy(() => import('./pages/admin/RegistrationRequestsPage'));
const UsersManagementPage = lazy(() => import('./pages/admin/UsersManagementPage'));
const AuditLogsPage = lazy(() => import('./pages/admin/AuditLogsPage'));

// Manager pages
const ManagerDashboard = lazy(() => import('./pages/manager/ManagerDashboard'));
const ProjectsPage = lazy(() => import('./pages/manager/ProjectsPage'));
const CreateProjectPage = lazy(() => import('./pages/manager/CreateProjectPage'));
const ProjectRequestsPage = lazy(() => import('./pages/manager/ProjectRequestsPage'));
const ClientsPage = lazy(() => import('./pages/manager/ClientsPage'));
const TeamManagementPage = lazy(() => import('./pages/manager/TeamManagementPage'));
const EmployeeWorkloadPage = lazy(() => import('./pages/manager/EmployeeWorkloadPage'));

// Employee pages
const EmployeeDashboard = lazy(() => import('./pages/employee/EmployeeDashboard'));
const MyTasksPage = lazy(() => import('./pages/employee/MyTasksPage'));

// Client pages
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard'));
const ProjectRequestPage = lazy(() => import('./pages/client/ProjectRequestPage'));

// Project workspace
const ProjectWorkspace = lazy(() => import('./pages/project/ProjectWorkspace'));

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500">You don't have permission to access this page.</p>
        <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">Go home</a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register/manager" element={<GuestRoute><RegisterManagerPage /></GuestRoute>} />
        <Route path="/register/employee" element={<GuestRoute><RegisterEmployeePage /></GuestRoute>} />
        <Route path="/register/client" element={<GuestRoute><RegisterClientPage /></GuestRoute>} />
        <Route path="/invitation/:token" element={<InvitationAcceptPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Post-login setup */}
        <Route path="/profile-photo" element={
          <ProtectedRoute><ProfilePhotoUploadPage /></ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute><RoleRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/admin/registrations" element={
          <ProtectedRoute><RoleRoute allowedRoles={['ADMIN']}><RegistrationRequestsPage /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute><RoleRoute allowedRoles={['ADMIN']}><UsersManagementPage /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/admin/audit" element={
          <ProtectedRoute><RoleRoute allowedRoles={['ADMIN']}><AuditLogsPage /></RoleRoute></ProtectedRoute>
        } />

        {/* Manager routes */}
        <Route path="/manager/dashboard" element={
          <ProtectedRoute><RoleRoute allowedRoles={['PROJECT_MANAGER']}><ManagerDashboard /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/manager/projects" element={
          <ProtectedRoute><RoleRoute allowedRoles={['PROJECT_MANAGER']}><ProjectsPage /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/manager/projects/new" element={
          <ProtectedRoute><RoleRoute allowedRoles={['PROJECT_MANAGER']}><CreateProjectPage /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/manager/project-requests" element={
          <ProtectedRoute><RoleRoute allowedRoles={['PROJECT_MANAGER']}><ProjectRequestsPage /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/manager/clients" element={
          <ProtectedRoute><RoleRoute allowedRoles={['PROJECT_MANAGER']}><ClientsPage /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/manager/workload" element={
          <ProtectedRoute><RoleRoute allowedRoles={['PROJECT_MANAGER']}><EmployeeWorkloadPage /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/manager/projects/:projectId/team" element={
          <ProtectedRoute><RoleRoute allowedRoles={['PROJECT_MANAGER']}><TeamManagementPage /></RoleRoute></ProtectedRoute>
        } />

        {/* Employee routes */}
        <Route path="/employee/dashboard" element={
          <ProtectedRoute><RoleRoute allowedRoles={['EMPLOYEE']}><EmployeeDashboard /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/employee/tasks" element={
          <ProtectedRoute><RoleRoute allowedRoles={['EMPLOYEE']}><MyTasksPage /></RoleRoute></ProtectedRoute>
        } />

        {/* Client routes */}
        <Route path="/client/dashboard" element={
          <ProtectedRoute><RoleRoute allowedRoles={['CLIENT']}><ClientDashboard /></RoleRoute></ProtectedRoute>
        } />
        <Route path="/client/request" element={
          <ProtectedRoute><RoleRoute allowedRoles={['CLIENT']}><ProjectRequestPage /></RoleRoute></ProtectedRoute>
        } />

        {/* Project workspace — accessible by all authenticated project members */}
        <Route path="/projects/:projectId/*" element={
          <ProtectedRoute><ProjectWorkspace /></ProtectedRoute>
        } />

        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
