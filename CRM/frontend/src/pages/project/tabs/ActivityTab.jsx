import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { memoryApi } from '../../../api/memoryApi';
import Spinner from '../../../components/ui/Spinner';
import EmptyState from '../../../components/ui/EmptyState';
import { FileText } from 'lucide-react';

const TYPE_BADGE = 'bg-blue-100 text-blue-700';

export default function ActivityTab({ projectId }) {
  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['memory-cards-approved', projectId],
    queryFn: () => memoryApi.getCards(projectId, { status: 'APPROVED', page: 0, size: 20 })
      .then((r) => r?.content || r || []),
  });

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Project Requirements</h2>
      <p className="text-sm text-gray-500">
        Approved requirements captured from meetings and documents.
      </p>
      {cards.filter((c) => c.type === 'REQUIREMENT').length === 0 ? (
        <EmptyState
          icon={<FileText size={40} />}
          title="No requirements captured yet"
          description="Requirements will appear here after being extracted from meetings or documents"
        />
      ) : (
        <div className="space-y-3">
          {cards.filter((c) => c.type === 'REQUIREMENT').map((card) => (
            <div key={card.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <h4 className="font-medium text-gray-900">{card.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{card.content}</p>
              {card.sourceReference && (
                <p className="text-xs text-gray-400 mt-2">📎 {card.sourceReference}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
