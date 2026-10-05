import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

const components = [
  // Layout Components
  'components/layout/AppLayout.jsx',
  'components/layout/Sidebar.jsx',
  'components/layout/Header.jsx',
  'components/layout/NotificationPanel.jsx',
  'components/layout/ProjectSelector.jsx',

  // UI Components
  'components/ui/Button.jsx',
  'components/ui/Input.jsx',
  'components/ui/Select.jsx',
  'components/ui/Textarea.jsx',
  'components/ui/Badge.jsx',
  'components/ui/Card.jsx',
  'components/ui/Modal.jsx',
  'components/ui/ConfirmDialog.jsx',
  'components/ui/Table.jsx',
  'components/ui/Tabs.jsx',
  'components/ui/Avatar.jsx',
  'components/ui/Spinner.jsx',
  'components/ui/EmptyState.jsx',
  'components/ui/FileUpload.jsx',
  'components/ui/SearchInput.jsx',
  'components/ui/DatePicker.jsx',
  'components/ui/StatusBadge.jsx',
  'components/ui/PriorityBadge.jsx',
  'components/ui/Toast.jsx',
  'components/ui/Pagination.jsx',

  // Shared Components
  'components/shared/UserAvatar.jsx',
  'components/shared/UserCard.jsx',
  'components/shared/ProjectCard.jsx',
  'components/shared/TaskCard.jsx',
  'components/shared/MemoryCardItem.jsx',
  'components/shared/NotificationItem.jsx',

  // Auth Pages
  'pages/auth/LoginPage.jsx',
  'pages/auth/RegisterManagerPage.jsx',
  'pages/auth/RegisterEmployeePage.jsx',
  'pages/auth/RegisterClientPage.jsx',
  'pages/auth/InvitationAcceptPage.jsx',
  'pages/auth/ProfilePhotoUploadPage.jsx',
  'pages/auth/ForgotPasswordPage.jsx',
  'pages/auth/ResetPasswordPage.jsx',

  // Admin Pages
  'pages/admin/AdminDashboard.jsx',
  'pages/admin/RegistrationRequestsPage.jsx',
  'pages/admin/UsersManagementPage.jsx',
  'pages/admin/UserDetailPage.jsx',
  'pages/admin/InviteAdminPage.jsx',
  'pages/admin/SystemSettingsPage.jsx',
  'pages/admin/AuditLogsPage.jsx',

  // Manager Pages
  'pages/manager/ManagerDashboard.jsx',
  'pages/manager/ClientsPage.jsx',
  'pages/manager/ProjectRequestsPage.jsx',
  'pages/manager/ProjectsPage.jsx',
  'pages/manager/CreateProjectPage.jsx',
  'pages/manager/ProjectDetailPage.jsx',
  'pages/manager/TeamManagementPage.jsx',
  'pages/manager/EmployeeWorkloadPage.jsx',
  'pages/manager/RegistrationReviewPage.jsx',

  // Employee Pages
  'pages/employee/EmployeeDashboard.jsx',
  'pages/employee/MyProjectsPage.jsx',
  'pages/employee/MyTasksPage.jsx',

  // Client Pages
  'pages/client/ClientDashboard.jsx',
  'pages/client/ProjectRequestPage.jsx',
  'pages/client/MyProjectsPage.jsx',

  // Project Workspace Pages
  'pages/project/ProjectWorkspace.jsx',
  'pages/project/tabs/OverviewTab.jsx',
  'pages/project/tabs/TeamTab.jsx',
  'pages/project/tabs/TasksTab.jsx',
  'pages/project/tabs/ChatTab.jsx',
  'pages/project/tabs/MeetingsTab.jsx',
  'pages/project/tabs/CallsTab.jsx',
  'pages/project/tabs/DocumentsTab.jsx',
  'pages/project/tabs/RequirementsTab.jsx',
  'pages/project/tabs/MemoryTab.jsx',
  'pages/project/tabs/ActivityTab.jsx',

  // Chat Components
  'components/chat/ChatWindow.jsx',
  'components/chat/MessageList.jsx',
  'components/chat/MessageItem.jsx',
  'components/chat/MessageComposer.jsx',
  'components/chat/DirectMessagePage.jsx',

  // Meeting Components
  'components/meetings/MeetingCard.jsx',
  'components/meetings/MeetingForm.jsx',
  'components/meetings/MeetingNotesEditor.jsx',
  'components/meetings/MeetingOutcomeSubmit.jsx',

  // Call Components
  'components/calls/CallRoom.jsx',
  'components/calls/VideoTile.jsx',
  'components/calls/CallControls.jsx',

  // Memory Components
  'components/memory/MemoryCardDetail.jsx',
  'components/memory/MemoryCardEditor.jsx',
  'components/memory/ReviewQueue.jsx',
  'components/memory/MemoryCardForm.jsx',

  // AI Assistant
  'components/ai/AIAssistant.jsx',
  'components/ai/AIMessage.jsx',
  'components/ai/SourceReference.jsx',

  // Document Components
  'components/documents/DocumentList.jsx',
  'components/documents/DocumentUpload.jsx',
  'components/documents/DocumentViewer.jsx',

  // Notification Components
  'components/notifications/NotificationBell.jsx',
  'components/notifications/NotificationList.jsx',
];

const apiFiles = [
  'api/authApi.js', 'api/usersApi.js', 'api/projectsApi.js', 'api/projectRequestsApi.js',
  'api/tasksApi.js', 'api/communicationApi.js', 'api/meetingsApi.js', 'api/documentsApi.js',
  'api/memoryApi.js', 'api/ragApi.js', 'api/adminApi.js', 'api/notificationsApi.js'
];

const storeFiles = [
  'store/authStore.js', 'store/projectStore.js', 'store/notificationStore.js'
];

const hookFiles = [
  'hooks/useAuth.js', 'hooks/useProject.js', 'hooks/useWebSocket.js', 
  'hooks/useNotifications.js', 'hooks/usePermissions.js'
];

const getComponentName = (filePath) => {
  const base = path.basename(filePath, '.jsx');
  return base.replace(/[^a-zA-Z0-9]/g, '');
};

components.forEach(filePath => {
  const fullPath = path.join(srcDir, filePath);
  const name = getComponentName(filePath);
  const content = \`import React from 'react';\n\nexport default function \${name}() {\n  return (\n    <div className="p-4 bg-white rounded shadow">\n      <h2 className="text-xl font-bold">\${name}</h2>\n    </div>\n  );\n}\n\`;
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});

apiFiles.forEach(filePath => {
  const fullPath = path.join(srcDir, filePath);
  const content = \`import { client } from './client';\n\nexport const fetch\${path.basename(filePath, '.js')} = async () => {\n  const response = await client.get('/endpoint');\n  return response.data;\n};\n\`;
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});

storeFiles.forEach(filePath => {
  const fullPath = path.join(srcDir, filePath);
  const content = \`import { create } from 'zustand';\n\nexport const use\${path.basename(filePath, '.js')} = create((set) => ({\n  data: null,\n  setData: (data) => set({ data }),\n}));\n\`;
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});

hookFiles.forEach(filePath => {
  const fullPath = path.join(srcDir, filePath);
  const content = \`import { useState, useEffect } from 'react';\n\nexport const \${path.basename(filePath, '.js')} = () => {\n  const [value, setValue] = useState(null);\n  return value;\n};\n\`;
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
});

console.log("Generated all missing files!");
