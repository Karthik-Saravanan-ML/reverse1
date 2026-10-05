import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../../api/projectsApi';
import { useAuthStore } from '../../store/authStore';
import AppLayout from '../../components/layout/AppLayout';
import Spinner from '../../components/ui/Spinner';
import AIAssistant from '../../components/ai/AIAssistant';

import OverviewTab from './tabs/OverviewTab';
import TeamTab from './tabs/TeamTab';
import TasksTab from './tabs/TasksTab';
import ChatTab from './tabs/ChatTab';
import MeetingsTab from './tabs/MeetingsTab';
import CallsTab from './tabs/CallsTab';
import DocumentsTab from './tabs/DocumentsTab';
import MemoryTab from './tabs/MemoryTab';
import ActivityTab from './tabs/ActivityTab';

import {
  LayoutDashboard, Users, CheckSquare, MessageSquare,
  Video, Phone, FileText, Brain, Activity, ArrowLeft, Bot
} from 'lucide-react';

const ALL_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, component: OverviewTab },
  { id: 'team', label: 'Team', icon: Users, component: TeamTab },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, component: TasksTab },
  { id: 'chat', label: 'Chat', icon: MessageSquare, component: ChatTab },
  { id: 'meetings', label: 'Meetings', icon: Video, component: MeetingsTab },
  { id: 'calls', label: 'Calls', icon: Phone, component: CallsTab },
  { id: 'documents', label: 'Documents', icon: FileText, component: DocumentsTab },
  { id: 'memory', label: 'Memory', icon: Brain, component: MemoryTab },
  { id: 'activity', label: 'Activity', icon: Activity, component: ActivityTab },
];

const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-700',
  ON_HOLD: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
  DRAFT: 'bg-gray-100 text-gray-600',
};

export default function ProjectWorkspace() {
  const { projectId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState('overview');
  const [showAI, setShowAI] = React.useState(false);

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.getProject(projectId),
    enabled: !!projectId,
    retry: 1,
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-24"><Spinner size="lg" /></div>
      </AppLayout>
    );
  }

  if (error || !project) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-500 mb-4">You may not have access to this project.</p>
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Go back</button>
        </div>
      </AppLayout>
    );
  }

  const ActiveComponent = ALL_TABS.find(t => t.id === activeTab)?.component;

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Project Header */}
        <div className="bg-white border-b border-gray-200 px-6 pt-4 pb-0 flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900">{project.title}</h1>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[project.status] || 'bg-gray-100 text-gray-600'}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{project.projectType}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Progress bar */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${project.progressPercentage || 0}%` }}
                  />
                </div>
                <span className="font-medium text-gray-700">{project.progressPercentage || 0}%</span>
              </div>

              {/* AI Assistant toggle */}
              <button
                onClick={() => setShowAI(!showAI)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                  showAI ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Bot size={16} />
                AI
              </button>
            </div>
          </div>

          {/* Tab navigation */}
          <nav className="flex gap-0 overflow-x-auto">
            {ALL_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content + AI Panel */}
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            {ActiveComponent && (
              <ActiveComponent projectId={projectId} project={project} />
            )}
          </main>

          {/* AI Assistant Panel */}
          {showAI && (
            <div className="w-96 border-l border-gray-200 bg-white flex-shrink-0 flex flex-col overflow-hidden">
              <AIAssistant projectId={projectId} />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
