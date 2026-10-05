import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memoryApi } from '../../api/memoryApi';
import { CheckCircle, XCircle, Edit2, Clock, ChevronRight, Filter } from 'lucide-react';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';

const TYPE_COLORS = {
  REQUIREMENT: 'bg-blue-100 text-blue-700',
  DECISION: 'bg-purple-100 text-purple-700',
  APPROVAL: 'bg-green-100 text-green-700',
  ACTION: 'bg-orange-100 text-orange-700',
  QUESTION: 'bg-yellow-100 text-yellow-700',
  RISK: 'bg-red-100 text-red-700',
  ISSUE: 'bg-rose-100 text-rose-700',
  CHANGE_REQUEST: 'bg-indigo-100 text-indigo-700',
  CLIENT_FEEDBACK: 'bg-teal-100 text-teal-700',
};

function ReviewCard({ card, onApprove, onReject, onEdit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[card.type] || 'bg-gray-100 text-gray-700'}`}>
              {card.type.replace('_', ' ')}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm leading-tight">{card.title}</h4>
              {card.sourceReference && (
                <p className="text-xs text-gray-400 mt-0.5">Source: {card.sourceReference}</p>
              )}
            </div>
          </div>
          {card.confidenceScore && (
            <span className={`text-xs font-medium flex-shrink-0 ${
              card.confidenceScore >= 0.8 ? 'text-green-600' : 
              card.confidenceScore >= 0.5 ? 'text-yellow-600' : 'text-red-500'
            }`}>
              {Math.round(card.confidenceScore * 100)}%
            </span>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          {expanded ? 'Show less' : 'Show content'}
          <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>

        {expanded && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
            {card.content}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => onApprove(card.id)}
            className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <CheckCircle size={14} /> Approve
          </button>
          <button
            onClick={() => onEdit(card)}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Edit2 size={14} /> Edit & Approve
          </button>
          <button
            onClick={() => onReject(card.id)}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <XCircle size={14} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewQueue({ projectId }) {
  const queryClient = useQueryClient();

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['memory-review-queue', projectId],
    queryFn: () => memoryApi.getReviewQueue(projectId),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ cardId, decision, editedContent }) =>
      memoryApi.reviewCard(projectId, cardId, { decision, ...editedContent }),
    onSuccess: () => {
      queryClient.invalidateQueries(['memory-review-queue', projectId]);
      queryClient.invalidateQueries(['memory-cards', projectId]);
    },
  });

  if (isLoading) return <Spinner />;
  if (cards.length === 0) {
    return (
      <EmptyState
        icon={<CheckCircle size={40} />}
        title="Review queue is empty"
        description="All memory cards have been reviewed"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-orange-500" />
          <h3 className="font-semibold text-gray-900">Pending Review</h3>
          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {cards.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {cards.map((card) => (
          <ReviewCard
            key={card.id}
            card={card}
            onApprove={(id) => reviewMutation.mutate({ cardId: id, decision: 'APPROVED' })}
            onReject={(id) => reviewMutation.mutate({ cardId: id, decision: 'REJECTED' })}
            onEdit={(card) => {/* opens edit modal */}}
          />
        ))}
      </div>
    </div>
  );
}
