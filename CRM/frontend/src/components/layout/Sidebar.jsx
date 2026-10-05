import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useProjectStore } from '../../store/projectStore';
import { 
  LayoutDashboard, Users, FolderKanban, ClipboardList, 
  Settings, Brain, Clock, ShieldCheck, Building2
} from 'lucide-react';
import { clsx } from 'clsx';

const ROLE_NAV_ITEMS = {
  ADMIN: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Registrations', href: '/admin/registrations', icon: ShieldCheck },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Audit Logs', href: '/admin/audit', icon: Clock },
  ],
  PROJECT_MANAGER: [
    { name: 'Dashboard', href: '/manager/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/manager/projects', icon: FolderKanban },
    { name: 'Project Requests', href: '/manager/project-requests', icon: ClipboardList },
    { name: 'Clients', href: '/manager/clients', icon: Building2 },
    { name: 'Team Workload', href: '/manager/workload', icon: Users },
  ],
  EMPLOYEE: [
    { name: 'Dashboard', href: '/employee/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', href: '/employee/tasks', icon: ClipboardList },
  ],
  CLIENT: [
    { name: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
    { name: 'New Request', href: '/client/request', icon: ClipboardList },
  ],
};

export default function Sidebar({ onClose }) {
  const { user } = useAuthStore();
  const { projects } = useProjectStore();
  const location = useLocation();

  const navItems = user?.role ? ROLE_NAV_ITEMS[user.role] : [];

  return (
    <div className="flex flex-col h-full bg-[#0B1120]">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 bg-gray-900 border-b border-gray-800">
        <Brain size={24} className="text-blue-500 mr-2" />
        <span className="text-lg font-bold text-white tracking-wide">AI-Native CRM</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Project Quick Links */}
        {projects?.length > 0 && (
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Active Projects
            </h3>
            <div className="space-y-1">
              {projects.map((project) => (
                <NavLink
                  key={project.id}
                  to={`/projects/${project.id}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors',
                      isActive
                        ? 'bg-gray-800 text-white font-medium'
                        : 'text-gray-400 hover:text-white'
                    )
                  }
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="truncate">{project.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Info / Settings (Bottom) */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
