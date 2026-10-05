import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import projectsApi from '../../api/projectsApi';
import { format } from 'date-fns';

export default function ProjectRequestsPage() {
  const [tab, setTab] = useState('PENDING');
  const [approveModal, setApproveModal] = useState({ open: false, id: null });
  const [rejectModal, setRejectModal] = useState({ open: false, id: null });
  const [approveData, setApproveData] = useState({ title: '', startDate: '', targetDate: '' });
  const [rejectReason, setRejectReason] = useState('');
  
  const qc = useQueryClient();
  const { data: requests = [] } = useQuery({ queryKey: ['projectRequests'], queryFn: projectsApi.getRequests });

  const approve = useMutation({
    mutationFn: ({id, data}) => projectsApi.approveRequest(id, data),
    onSuccess: () => { setApproveModal({open: false, id: null}); qc.invalidateQueries(['projectRequests']); }
  });

  const reject = useMutation({
    mutationFn: ({id, reason}) => projectsApi.rejectRequest(id, reason),
    onSuccess: () => { setRejectModal({open: false, id: null}); qc.invalidateQueries(['projectRequests']); }
  });

  const filtered = requests.filter(r => tab === 'ALL' || r.status === tab);

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Client Project Requests</h1>
        <div className="flex gap-4 mb-6">
          {['PENDING', 'REVIEWING', 'APPROVED', 'ALL'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`font-semibold ${tab === t ? 'text-blue-600' : 'text-gray-500'}`}>{t}</button>
          ))}
        </div>
        <div className="grid gap-4">
          {filtered.map(r => (
            <div key={r.id} className="border p-4 rounded shadow-sm bg-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{r.title}</h3>
                  <div className="text-sm text-gray-600">{r.clientName} - {r.company}</div>
                </div>
                <div className="flex flex-col items-end gap-1 text-sm">
                  <span className="bg-gray-100 px-2 py-1 rounded">{r.status}</span>
                  <span className={`px-2 py-1 rounded text-white ${r.priority === 'HIGH' || r.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-blue-500'}`}>{r.priority}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-4">Submitted: {r.submittedDate ? format(new Date(r.submittedDate), 'PP') : 'N/A'}</div>
              <details className="mb-4 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                <summary className="cursor-pointer font-medium mb-2">View Requirements</summary>
                <div className="mt-2"><strong className="block mb-1">Problem:</strong> {r.businessProblem}</div>
                <div className="mt-2"><strong className="block mb-1">Requirements:</strong> {r.initialRequirements}</div>
              </details>
              {r.status !== 'APPROVED' && r.status !== 'REJECTED' && (
                <div className="flex gap-2">
                  <Button onClick={() => setApproveModal({open: true, id: r.id})} className="bg-green-600">Approve to Project</Button>
                  <Button onClick={() => setRejectModal({open: true, id: r.id})} className="bg-red-600">Reject</Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <Modal isOpen={approveModal.open} onClose={() => setApproveModal({open: false, id: null})}>
          <div className="p-4 space-y-4">
            <h2 className="font-bold text-lg">Approve Request</h2>
            <Input label="Project Title" value={approveData.title} onChange={e => setApproveData({...approveData, title: e.target.value})} />
            <Input label="Start Date" type="date" value={approveData.startDate} onChange={e => setApproveData({...approveData, startDate: e.target.value})} />
            <Input label="Target Date" type="date" value={approveData.targetDate} onChange={e => setApproveData({...approveData, targetDate: e.target.value})} />
            <Button onClick={() => approve.mutate({id: approveModal.id, data: approveData})}>Confirm Approval</Button>
          </div>
        </Modal>

        <Modal isOpen={rejectModal.open} onClose={() => setRejectModal({open: false, id: null})}>
          <div className="p-4 space-y-4">
            <h2 className="font-bold text-lg">Reject Request</h2>
            <textarea className="w-full border p-2" rows={4} placeholder="Reason..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            <Button onClick={() => reject.mutate({id: rejectModal.id, reason: rejectReason})} className="bg-red-600">Confirm Rejection</Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
