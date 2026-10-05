import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '../../components/layout/AppLayout';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import clientsApi from '../../api/clientsApi'; // Assumed to exist or use custom fetch

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  
  // Try to use clientsApi if it exists, otherwise a fallback fetch
  const { data: clients = [], isLoading } = useQuery({ 
    queryKey: ['clients'], 
    queryFn: async () => {
      if (clientsApi?.getClients) return clientsApi.getClients();
      const res = await fetch('/api/clients');
      return res.json();
    }
  });

  const filtered = clients.filter(c => 
    (c.companyName || c.company || '').toLowerCase().includes(search.toLowerCase()) || 
    (c.contactName || c.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Clients Directory</h1>
        <div className="mb-6 max-w-md">
          <Input placeholder="Search by company or contact name..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {isLoading ? <div>Loading...</div> : filtered.length === 0 ? <EmptyState message="No clients found" /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(c => (
              <div key={c.id} className="border p-4 rounded shadow bg-white">
                <h3 className="font-bold text-lg mb-1">{c.companyName || c.company || 'Unknown Company'}</h3>
                <div className="text-sm text-gray-600 mb-3">{c.industry || 'No industry specified'}</div>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">Contact:</span> {c.contactName || c.name}</div>
                  <div><span className="font-medium">Email:</span> {c.email}</div>
                  {c.website && <div><span className="font-medium">Website:</span> <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{c.website}</a></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
