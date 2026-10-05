import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import projectsApi from '../../api/projectsApi';
import { format } from 'date-fns';

export default function ProjectsPage() {
  const [tab, setTab] = useState('ALL');
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: projectsApi.getProjects });

  const filtered = projects.filter(p => tab === 'ALL' || p.status === tab);

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Button onClick={() => navigate('/manager/projects/new')}>Create Project</Button>
        </div>
        <div className="flex gap-4 mb-6 border-b pb-2">
          {['ALL', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`font-semibold ${tab === t ? 'text-blue-600' : 'text-gray-500'}`}>{t}</button>
          ))}
        </div>
        {isLoading ? <div>Loading...</div> : filtered.length === 0 ? <EmptyState message="No projects" /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="border p-4 rounded shadow cursor-pointer hover:shadow-md" onClick={() => navigate(`/projects/${p.id}`)}>
                <h3 className="font-bold text-lg mb-1">{p.title}</h3>
                <div className="text-sm text-gray-500 mb-2">{p.projectType} • <span className="bg-gray-100 px-2 py-1 rounded">{p.status}</span></div>
                <div className="mb-2">
                  <div className="text-xs mb-1">Progress: {p.progressPercentage || 0}%</div>
                  <div className="w-full bg-gray-200 h-2 rounded"><div className="bg-blue-600 h-2 rounded" style={{width: `${p.progressPercentage || 0}%`}}></div></div>
                </div>
                <div className="text-sm flex justify-between text-gray-600">
                  <span>Team: {p.teamCount || 0}</span>
                  <span>Target: {p.targetDate ? format(new Date(p.targetDate), 'MMM d, yyyy') : 'N/A'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
