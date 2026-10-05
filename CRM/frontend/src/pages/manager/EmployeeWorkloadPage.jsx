import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '../../components/layout/AppLayout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import projectsApi from '../../api/projectsApi';

export default function EmployeeWorkloadPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  
  const { data: workload = [], isLoading } = useQuery({ queryKey: ['workload'], queryFn: projectsApi.getEmployeeWorkload });

  const filtered = workload.filter(e => {
    if (filter === 'AVAILABLE' && e.activeProjects >= 3) return false;
    if (filter === 'FULL' && e.activeProjects < 3) return false;
    return (e.name || '').toLowerCase().includes(search.toLowerCase());
  });

  const getBadgeColor = (count) => {
    if (count >= 3) return 'bg-orange-100 text-orange-800';
    if (count === 2) return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Employee Workload</h1>
        <div className="flex gap-4 mb-6 max-w-xl">
          <div className="flex-1"><Input placeholder="Search name..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          <div className="w-48"><Select value={filter} onChange={e => setFilter(e.target.value)} options={[
            {value: 'ALL', label: 'All'},
            {value: 'AVAILABLE', label: 'Available (< 3)'},
            {value: 'FULL', label: 'Full Capacity (= 3)'},
          ]} /></div>
        </div>
        {isLoading ? <div>Loading...</div> : (
          <div className="bg-white rounded shadow overflow-hidden border">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Department</th><th className="p-3">Active Projects</th><th className="p-3">Skills</th></tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td className="p-3 font-medium">{e.name}</td>
                    <td className="p-3 text-gray-500">{e.email}</td>
                    <td className="p-3 text-gray-500">{e.department}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getBadgeColor(e.activeProjects)}`}>
                        {e.activeProjects} {e.activeProjects === 1 ? 'Project' : 'Projects'}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 text-sm">{(e.skills || []).join(', ') || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
