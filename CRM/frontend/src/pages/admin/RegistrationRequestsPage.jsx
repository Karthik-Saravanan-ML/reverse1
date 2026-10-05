import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import adminApi from '../../api/adminApi';
import { format } from 'date-fns';

export default function RegistrationRequestsPage() {
  const [tab, setTab] = useState('PENDING');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [reason, setReason] = useState('');
  const qc = useQueryClient();

  const { data: reqs, isLoading } = useQuery({ queryKey: ['reqs'], queryFn: adminApi.getRegistrationRequests });

  const approve = useMutation({
    mutationFn: id => adminApi.approveRequest(id),
    onSuccess: () => { alert('Approved'); qc.invalidateQueries(['reqs']); }
  });

  const reject = useMutation({
    mutationFn: ({id, r}) => adminApi.rejectRequest(id, r),
    onSuccess: () => { alert('Rejected'); setRejectModalOpen(false); qc.invalidateQueries(['reqs']); }
  });

  if (isLoading) return <AppLayout><div className="p-6 max-w-7xl mx-auto"><Spinner /></div></AppLayout>;
  
  const list = (reqs || []).filter(r => tab === 'ALL' || r.status === tab);

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Registration Requests</h1>
        <div className="flex gap-4 mb-4">
          <button onClick={() => setTab('PENDING')} className={tab === 'PENDING' ? 'font-bold' : ''}>PENDING</button>
          <button onClick={() => setTab('ALL')} className={tab === 'ALL' ? 'font-bold' : ''}>ALL</button>
        </div>
        {list.length === 0 ? <EmptyState message="No requests" /> : (
          <div className="grid gap-4">
            {list.map(r => (
              <div key={r.id} className="border p-4 rounded flex justify-between">
                <div>
                  <h3 className="font-bold">{r.name} ({r.email})</h3>
                  <div className="text-sm">Role: <span className="bg-blue-100 text-blue-800 px-1 rounded">{r.role}</span></div>
                  <div className="text-xs text-gray-500">Date: {r.submittedDate ? format(new Date(r.submittedDate), 'PP') : 'N/A'}</div>
                </div>
                {r.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button onClick={() => approve.mutate(r.id)} className="bg-green-600">Approve</Button>
                    <Button onClick={() => { setSelectedId(r.id); setRejectModalOpen(true); }} className="bg-red-600">Reject</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)}>
          <div className="p-4">
            <h2 className="font-bold mb-2">Reject Reason</h2>
            <textarea className="w-full border p-2 mb-2" value={reason} onChange={e => setReason(e.target.value)} />
            <Button onClick={() => reject.mutate({id: selectedId, r: reason})}>Submit</Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
