import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import UserAvatar from '../../components/shared/UserAvatar';
import adminApi from '../../api/adminApi';

export default function UsersManagementPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const qc = useQueryClient();

  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: adminApi.getUsers });

  const updateStatus = useMutation({
    mutationFn: ({id, status}) => adminApi.updateUserStatus(id, {status}),
    onSuccess: () => qc.invalidateQueries(['users'])
  });

  const handleStatusChange = (id, newStatus) => {
    if (confirm(`Change status to ${newStatus}?`)) {
      updateStatus.mutate({id, status: newStatus});
    }
  };

  const filtered = users.filter(u => 
    (roleFilter === 'ALL' || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Users Management</h1>
        <div className="flex gap-4 mb-4">
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          <Select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} options={[
            {value: 'ALL', label: 'All Roles'},
            {value: 'ADMIN', label: 'ADMIN'},
            {value: 'PROJECT_MANAGER', label: 'PROJECT_MANAGER'},
            {value: 'EMPLOYEE', label: 'EMPLOYEE'},
            {value: 'CLIENT', label: 'CLIENT'},
          ]} />
        </div>
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b"><th className="p-2">User</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b">
                <td className="p-2 flex items-center gap-2">
                  <UserAvatar user={u} />
                  <div><div className="font-bold">{u.name}</div><div className="text-sm">{u.email}</div></div>
                </td>
                <td>{u.role}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${u.status === 'ACTIVE' ? 'bg-green-100' : u.status === 'SUSPENDED' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="gap-2 flex p-2">
                  <Button onClick={() => handleStatusChange(u.id, 'ACTIVE')} className="text-xs p-1 bg-green-500">Activate</Button>
                  <Button onClick={() => handleStatusChange(u.id, 'SUSPENDED')} className="text-xs p-1 bg-yellow-500">Suspend</Button>
                  <Button onClick={() => handleStatusChange(u.id, 'TERMINATED')} className="text-xs p-1 bg-red-500">Terminate</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
