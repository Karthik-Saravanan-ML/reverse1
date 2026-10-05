import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../components/layout/AppLayout';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import tasksApi from '../../api/tasksApi';
import { format } from 'date-fns';

export default function MyTasksPage() {
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateData, setUpdateData] = useState({ status: '', progressPercentage: 0, progressNotes: '' });
  const qc = useQueryClient();

  const { data: tasks = [] } = useQuery({ queryKey: ['myTasks'], queryFn: tasksApi.getMyTasks });

  const updateTask = useMutation({
    mutationFn: (data) => tasksApi.updateStatus(data.projectId, data.taskId, { 
      status: data.status, 
      progressPercentage: parseInt(data.progressPercentage), 
      progressNotes: data.progressNotes 
    }),
    onSuccess: () => { setSelectedTask(null); qc.invalidateQueries(['myTasks']); }
  });

  const columns = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'IN_REVIEW', 'COMPLETED'];
  
  const projects = [...new Set(tasks.map(t => t.projectName))];
  const filtered = tasks.filter(t => projectFilter === 'ALL' || t.projectName === projectFilter);

  const getPriorityColor = (p) => {
    if (p === 'CRITICAL') return 'bg-red-100 text-red-800';
    if (p === 'HIGH') return 'bg-orange-100 text-orange-800';
    if (p === 'MEDIUM') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const openTask = (t) => {
    setSelectedTask(t);
    setUpdateData({ status: t.status || 'TODO', progressPercentage: t.progressPercentage || 0, progressNotes: t.progressNotes || '' });
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-64px)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <div className="w-64">
            <Select value={projectFilter} onChange={e => setProjectFilter(e.target.value)} options={[
              {value: 'ALL', label: 'All Projects'},
              ...projects.map(p => ({value: p, label: p}))
            ]} />
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {columns.map(col => (
            <div key={col} className="min-w-[280px] bg-gray-50 rounded-lg p-4 flex flex-col gap-3">
              <h3 className="font-bold text-gray-700 mb-2">{col.replace('_', ' ')}</h3>
              {filtered.filter(t => (t.status || 'TODO') === col).map(t => (
                <div key={t.id} onClick={() => openTask(t)} className="bg-white p-3 rounded shadow-sm border cursor-pointer hover:shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getPriorityColor(t.priority)}`}>{t.priority}</span>
                  </div>
                  <div className="font-medium mb-1 leading-snug">{t.title}</div>
                  <div className="text-xs text-gray-500 mb-3">{t.projectName}</div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                    <span>Due: {t.dueDate ? format(new Date(t.dueDate), 'MMM d') : '-'}</span>
                    <span>{t.progressPercentage || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded"><div className="bg-blue-500 h-1.5 rounded" style={{width: `${t.progressPercentage || 0}%`}}></div></div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {selectedTask && (
          <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)}>
            <div className="p-5">
              <h2 className="text-xl font-bold mb-1">{selectedTask.title}</h2>
              <div className="text-sm text-gray-500 mb-6">{selectedTask.projectName}</div>
              
              <div className="space-y-4">
                <Select label="Status" value={updateData.status} onChange={e => setUpdateData({...updateData, status: e.target.value})} options={columns.map(c => ({value: c, label: c.replace('_', ' ')}))} />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progress: {updateData.progressPercentage}%</label>
                  <input type="range" min="0" max="100" value={updateData.progressPercentage} onChange={e => setUpdateData({...updateData, progressPercentage: e.target.value})} className="w-full" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea className="w-full border rounded p-2 text-sm" rows={3} value={updateData.progressNotes} onChange={e => setUpdateData({...updateData, progressNotes: e.target.value})} />
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button onClick={() => setSelectedTask(null)} className="bg-gray-100 text-gray-700">Cancel</Button>
                  <Button onClick={() => updateTask.mutate({projectId: selectedTask.projectId, taskId: selectedTask.id, ...updateData})} disabled={updateTask.isPending}>Save Updates</Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </AppLayout>
  );
}
