import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../../../api/tasksApi';
import { useAuthStore } from '../../../store/authStore';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import EmptyState from '../../../components/ui/EmptyState';
import { Plus, Filter, CheckSquare, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

const STATUSES = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'IN_REVIEW', 'COMPLETED'];

const STATUS_COLORS = {
  TODO: 'bg-gray-100',
  IN_PROGRESS: 'bg-blue-50',
  BLOCKED: 'bg-red-50',
  IN_REVIEW: 'bg-yellow-50',
  COMPLETED: 'bg-green-50',
};

const STATUS_BADGE = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  BLOCKED: 'bg-red-100 text-red-700',
  IN_REVIEW: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const PRIORITY_COLORS = {
  LOW: 'bg-gray-200 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-600',
  CRITICAL: 'bg-red-100 text-red-600',
};

function TaskCard({ task, onStatusChange, canEdit }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1">{task.title}</h4>
        <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between gap-2">
        {task.assignee && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <User size={12} />
            <span>{task.assignee?.firstName} {task.assignee?.lastName}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
            <Calendar size={12} />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
        )}
      </div>
      {task.progressPercentage > 0 && (
        <div className="mt-2">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${task.progressPercentage}%` }}
            />
          </div>
        </div>
      )}
      {canEdit && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex gap-1 flex-wrap">
          {STATUSES.filter((s) => s !== task.status).map((s) => (
            <button
              key={s}
              onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, s); }}
              className="text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-0.5 rounded transition-colors"
            >
              → {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TasksTab({ projectId }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [view, setView] = useState('kanban');

  const canCreate = ['ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE'].includes(user?.role);
  const canEdit = ['ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE'].includes(user?.role);

  const { data: tasksPage, isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => tasksApi.getTasks(projectId),
  });

  const statusMutation = useMutation({
    mutationFn: ({ taskId, status }) =>
      tasksApi.updateStatus(projectId, taskId, { status }),
    onSuccess: () => queryClient.invalidateQueries(['tasks', projectId]),
  });

  const tasks = tasksPage?.content || tasksPage || [];

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  // Group by status for kanban
  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = tasks.filter((t) => t.status === s);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <CheckSquare size={20} className="text-blue-600" />
          Tasks
          <span className="text-sm font-normal text-gray-500">({tasks.length})</span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {['kanban', 'list'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                  view === v ? 'bg-white shadow text-gray-900' : 'text-gray-500'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          {canCreate && (
            <Button size="sm">
              <Plus size={14} className="mr-1" /> New Task
            </Button>
          )}
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare size={40} />}
          title="No tasks yet"
          description="Create tasks to track work for this project"
        />
      ) : view === 'kanban' ? (
        <div className="grid grid-cols-5 gap-4 min-w-max">
          {STATUSES.map((status) => (
            <div key={status} className="w-64">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${STATUS_BADGE[status]}`}>
                  {status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-400">{byStatus[status].length}</span>
              </div>
              <div className={`min-h-32 p-2 rounded-xl ${STATUS_COLORS[status]} space-y-2`}>
                {byStatus[status].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    canEdit={canEdit}
                    onStatusChange={(taskId, s) => statusMutation.mutate({ taskId, status: s })}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
              <span className={`text-xs font-medium px-2 py-1 rounded ${STATUS_BADGE[task.status]}`}>
                {task.status.replace('_', ' ')}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900">{task.title}</p>
                {task.assignee && (
                  <p className="text-xs text-gray-500">{task.assignee?.firstName} {task.assignee?.lastName}</p>
                )}
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </span>
              {task.dueDate && (
                <span className="text-xs text-gray-400">{format(new Date(task.dueDate), 'MMM d')}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
