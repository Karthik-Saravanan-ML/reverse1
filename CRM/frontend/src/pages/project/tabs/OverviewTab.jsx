import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../../../api/projectsApi';
import { tasksApi } from '../../../api/tasksApi';
import { meetingsApi } from '../../../api/meetingsApi';
import Spinner from '../../../components/ui/Spinner';
import { TrendingUp, CheckSquare, Calendar, Users, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
      <div className={`p-2.5 rounded-xl ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function OverviewTab({ projectId, project }) {
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks-overview', projectId],
    queryFn: () => tasksApi.getTasks(projectId).then((r) => r?.content || r || []),
  });

  const { data: team = [] } = useQuery({
    queryKey: ['team-overview', projectId],
    queryFn: () => projectsApi.getProjectTeam(projectId),
  });

  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const blocked = tasks.filter((t) => t.status === 'BLOCKED').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={CheckSquare} label="Total Tasks" value={tasks.length} color="blue" />
        <StatCard icon={TrendingUp} label="In Progress" value={inProgress} color="green" />
        <StatCard icon={AlertTriangle} label="Blocked" value={blocked} color="red" />
        <StatCard icon={Users} label="Team Members" value={team.length} color="blue" />
      </div>

      {/* Progress */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Task Progress</h3>
          <div className="flex gap-1 h-4 rounded-full overflow-hidden">
            {completed > 0 && (
              <div
                className="bg-green-500 transition-all"
                style={{ width: `${(completed / tasks.length) * 100}%` }}
                title={`${completed} completed`}
              />
            )}
            {inProgress > 0 && (
              <div
                className="bg-blue-400 transition-all"
                style={{ width: `${(inProgress / tasks.length) * 100}%` }}
                title={`${inProgress} in progress`}
              />
            )}
            {blocked > 0 && (
              <div
                className="bg-red-400 transition-all"
                style={{ width: `${(blocked / tasks.length) * 100}%` }}
                title={`${blocked} blocked`}
              />
            )}
            <div className="flex-1 bg-gray-100" />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> {completed} done</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> {inProgress} active</span>
            {blocked > 0 && <span className="flex items-center gap-1 text-red-500"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> {blocked} blocked</span>}
          </div>
        </div>
      )}

      {/* Project info */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 grid grid-cols-2 gap-4 text-sm">
        {project?.startDate && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Start Date</p>
            <p className="font-medium">{format(new Date(project.startDate), 'MMM d, yyyy')}</p>
          </div>
        )}
        {project?.targetDate && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Target Date</p>
            <p className="font-medium">{format(new Date(project.targetDate), 'MMM d, yyyy')}</p>
          </div>
        )}
        {project?.priority && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Priority</p>
            <p className="font-medium">{project.priority}</p>
          </div>
        )}
        {project?.progressPercentage !== undefined && (
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Overall Progress</p>
            <p className="font-medium">{project.progressPercentage}%</p>
          </div>
        )}
        {project?.description && (
          <div className="col-span-2">
            <p className="text-xs text-gray-400 mb-0.5">Description</p>
            <p className="text-gray-700">{project.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
