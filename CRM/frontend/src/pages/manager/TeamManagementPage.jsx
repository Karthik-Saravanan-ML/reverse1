import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import UserAvatar from '../../components/shared/UserAvatar';
import projectsApi from '../../api/projectsApi';

export default function TeamManagementPage() {
  const { projectId } = useParams();
  const [selectedUser, setSelectedUser] = useState('');
  const [error, setError] = useState('');
  const qc = useQueryClient();

  const { data: team = [] } = useQuery({ queryKey: ['team', projectId], queryFn: () => projectsApi.getProjectTeam(projectId) });
  const { data: employees = [] } = useQuery({ queryKey: ['availableEmployees'], queryFn: () => projectsApi.getAvailableEmployees() });

  const removeMember = useMutation({
    mutationFn: (userId) => projectsApi.removeTeamMember(projectId, userId),
    onSuccess: () => qc.invalidateQueries(['team', projectId])
  });

  const addMember = useMutation({
    mutationFn: (userId) => projectsApi.addTeamMember(projectId, {userId}),
    onSuccess: () => { setSelectedUser(''); setError(''); qc.invalidateQueries(['team', projectId]); qc.invalidateQueries(['availableEmployees']); },
    onError: (err) => setError(err.response?.data?.message || 'Error adding member')
  });

  const assignLead = useMutation({
    mutationFn: (userId) => projectsApi.assignTeamLead(projectId, userId),
    onSuccess: () => qc.invalidateQueries(['team', projectId])
  });

  const handleAdd = () => {
    if (!selectedUser) return;
    const emp = employees.find(e => e.id === selectedUser);
    if (emp && emp.activeProjects >= 3) {
      setError('Employee is at max capacity (3 projects)');
      return;
    }
    addMember.mutate(selectedUser);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Team Management</h1>
        
        <div className="bg-white p-4 rounded shadow mb-8 border">
          <h2 className="text-lg font-bold mb-4">Add Team Member</h2>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <Select 
                value={selectedUser} 
                onChange={e => { setSelectedUser(e.target.value); setError(''); }}
                options={[{value: '', label: 'Select employee...'}, ...employees.map(e => ({
                  value: e.id, 
                  label: `${e.name} (${e.activeProjects} active projects)`
                }))]} 
              />
              {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
            </div>
            <Button onClick={handleAdd} disabled={!selectedUser || addMember.isPending}>Add Member</Button>
          </div>
        </div>

        <div className="bg-white rounded shadow border">
          <h2 className="text-lg font-bold p-4 border-b">Current Team</h2>
          <div className="grid gap-0">
            {team.map(member => (
              <div key={member.id} className="flex items-center justify-between p-4 border-b last:border-0">
                <div className="flex items-center gap-4">
                  <UserAvatar user={member} />
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {member.name}
                      {member.isTeamLead && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Team Lead</span>}
                    </div>
                    <div className="text-sm text-gray-500">{member.role} • {member.activeProjects} active projects</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!member.isTeamLead && <Button onClick={() => assignLead.mutate(member.id)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none">Make Lead</Button>}
                  <Button onClick={() => confirm('Remove member?') && removeMember.mutate(member.id)} className="bg-red-50 text-red-600 hover:bg-red-100 border-none">Remove</Button>
                </div>
              </div>
            ))}
            {team.length === 0 && <div className="p-8 text-center text-gray-500">No team members assigned yet.</div>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
