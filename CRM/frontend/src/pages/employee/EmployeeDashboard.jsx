import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectsApi } from '../../api/projectsApi';
import { tasksApi } from '../../api/tasksApi';
import { useAuthStore } from '../../store/authStore';
import AppLayout from '../../components/layout/AppLayout';
import Spinner from '../../components/ui/Spinner';
import { FolderKanban, CheckSquare, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function EmployeeDashboard() {
  const { user } = useAuthStore();

  const { data: projects = [], isLoading: pLoading } = useQuery({
    queryKey: ['employee-projects'],
    queryFn: () => projectsApi.getProjects(),
  });

  if (pLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12"><Spinner /></div>
      </AppLayout>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'ACTIVE');

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName}</h1>
          <p className="text-gray-500 mt-1">Here are your active projects and assignments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/employee/tasks" className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl text-blue-600"><CheckSquare size={24} /></div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">My Tasks</h3>
                <p className="text-sm text-gray-600">View and manage your assignments</p>
              </div>
            </div>
            <ArrowRight className="text-blue-600" />
          </Link>
          
          <div className="p-6 bg-white border border-gray-200 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><FolderKanban size={24} /></div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{activeProjects.length} Active Projects</h3>
              <p className="text-sm text-gray-500">Currently assigned to you</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Your Projects</h2>
          {activeProjects.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">You are not currently assigned to any active projects.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProjects.map(project => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block p-5 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{project.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>{project.projectType}</span>
                    <span className="flex items-center gap-1 font-medium text-blue-600">
                      Go to workspace <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
