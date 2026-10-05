import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectsApi } from '../../api/projectsApi';
import { useAuthStore } from '../../store/authStore';
import AppLayout from '../../components/layout/AppLayout';
import Spinner from '../../components/ui/Spinner';
import { FolderKanban, ClipboardList, Users, ArrowRight, Building2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

function StatCard({ title, value, icon: Icon, color, to }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };

  return (
    <Link to={to} className={`block p-6 rounded-2xl border transition-shadow hover:shadow-md ${colors[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white/60`}>
          <Icon size={24} />
        </div>
        <ArrowRight size={20} className="opacity-50" />
      </div>
      <div>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-sm font-medium opacity-80">{title}</p>
      </div>
    </Link>
  );
}

export default function ManagerDashboard() {
  const { user } = useAuthStore();

  const { data: projects = [], isLoading: pLoading } = useQuery({
    queryKey: ['manager-projects'],
    queryFn: () => projectsApi.getProjects(),
  });

  const { data: requests = [], isLoading: rLoading } = useQuery({
    queryKey: ['manager-requests'],
    queryFn: () => projectsApi.getRequests(),
  });

  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length;

  if (pLoading || rLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12"><Spinner /></div>
      </AppLayout>
    );
  }

  const recentProjects = projects.slice(0, 3);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your projects today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Active Projects" 
            value={activeProjects} 
            icon={FolderKanban} 
            color="blue" 
            to="/manager/projects" 
          />
          <StatCard 
            title="Pending Requests" 
            value={pendingRequests} 
            icon={ClipboardList} 
            color="orange" 
            to="/manager/project-requests" 
          />
          <StatCard 
            title="Team Workload" 
            value="View" 
            icon={Users} 
            color="purple" 
            to="/manager/workload" 
          />
          <StatCard 
            title="Clients" 
            value="View" 
            icon={Building2} 
            color="green" 
            to="/manager/clients" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                Recent Projects
              </h2>
              <Link to="/manager/projects" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>
            
            {recentProjects.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No active projects</p>
            ) : (
              <div className="space-y-4">
                {recentProjects.map(project => (
                  <Link 
                    key={project.id} 
                    to={`/projects/${project.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <span>{project.projectType}</span>
                        <span>•</span>
                        <span>{format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{project.progressPercentage}%</p>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${project.progressPercentage}%` }} />
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/manager/projects/new" className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><FolderKanban size={18} /></div>
                <span className="font-medium text-sm">Create New Project</span>
              </Link>
              <Link to="/manager/project-requests" className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors">
                <div className="p-2 bg-orange-500/20 text-orange-400 rounded-lg"><ClipboardList size={18} /></div>
                <span className="font-medium text-sm">Review Requests</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
