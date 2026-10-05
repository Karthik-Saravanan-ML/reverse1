import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '../../components/layout/AppLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import adminApi from '../../api/adminApi';
import { format } from 'date-fns';

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['auditLogs', page, fromDate, toDate],
    queryFn: () => adminApi.getAuditLogs({ page, size: 20, fromDate, toDate })
  });

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
        <div className="flex gap-4 mb-4">
          <Input type="date" label="From" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          <Input type="date" label="To" value={toDate} onChange={e => setToDate(e.target.value)} />
        </div>
        {isLoading ? <div>Loading...</div> : (
          <>
            <table className="w-full text-left border-collapse border mb-4">
              <thead><tr className="bg-gray-100 border-b"><th className="p-2">Timestamp</th><th>Actor Email</th><th>Action</th><th>Entity Type</th><th>IP Address</th></tr></thead>
              <tbody>
                {(data?.logs || []).map((l, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{l.timestamp ? format(new Date(l.timestamp), 'PPpp') : ''}</td>
                    <td>{l.actorEmail}</td>
                    <td>{l.action}</td>
                    <td>{l.entityType}</td>
                    <td>{l.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-4 justify-between">
              <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
              <Button onClick={() => setPage(p => p + 1)} disabled={!data?.hasNextPage}>Next</Button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
