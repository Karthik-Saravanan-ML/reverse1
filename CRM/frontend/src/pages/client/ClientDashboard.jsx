import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { projectsApi } from '../../api/projectsApi';
import { useAuthStore } from '../../store/authStore';
import AppLayout from '../../components/layout/AppLayout';
import Spinner from '../../components/ui/Spinner';
import { FolderKanban, Plus, Clock, ArrowRight } from 'lucide-react';

export default function ClientDashboard() {
  const { user } = useAuthStore();

  const { data: projects = [], isLoading: pLoading } = useQuery({
    queryKey: ['client-projects'],
    queryFn: () => projectsApi.getProjects(),
  });

  const { data: requests = [], isLoading: rLoading } = useQuery({
    queryKey: ['client-requests'],
    queryFn: () => projectsApi.getRequests(),
  });

  if (pLoading || rLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-12"><Spinner /></div>
      </AppLayout>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'ACTIVE');
  const pendingRequests = requests.filter(r => r.status === 'PENDING' || r.status === 'REVIEWING');

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName}</h1>
            <p className="text-gray-500 mt-1">Track your projects and submit new requests.</p>
          </div>
          <Link
            to="/client/request"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
          >
            <Plus size={16} /> New Project Request
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FolderKanban size={20} className="text-blue-600" />
              Your Active Projects
            </h2>
            
            {activeProjects.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <FolderKanban size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No active projects right now</p>
                <p className="text-sm text-gray-400 mt-1">Submit a new request to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeProjects.map(project => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all group"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{project.description}</p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium">
                      <span className="text-gray-500">Progress: {project.progressPercentage}%</span>
                      <span className="flex items-center gap-1 text-blue-600">
                        View <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pending Requests */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <Clock size={20} className="text-orange-500" />
              Pending Requests
            </h2>
            
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {pendingRequests.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  No pending requests.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingRequests.map(req => (
                    <div key={req.id} className="p-4">
                      <h4 className="font-medium text-gray-900 text-sm">{req.title}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                          req.status === 'PENDING' ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
