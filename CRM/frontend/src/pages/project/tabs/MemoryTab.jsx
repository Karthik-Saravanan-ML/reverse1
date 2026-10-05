import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memoryApi } from '../../../api/memoryApi';
import { useAuthStore } from '../../../store/authStore';
import { usePermissions } from '../../../hooks/usePermissions';
import ReviewQueue from '../../../components/memory/ReviewQueue';
import MemoryCardDetail from '../../../components/memory/MemoryCardDetail';
import MemoryCardForm from '../../../components/memory/MemoryCardForm';
import Spinner from '../../../components/ui/Spinner';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '../../../components/ui/Button';
import { Plus, Filter, Brain } from 'lucide-react';

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

const ALL_TYPES = Object.keys(TYPE_COLORS);

export default function MemoryTab({ projectId }) {
  const { user } = useAuthStore();
  const [view, setView] = useState('cards'); // 'cards' | 'review'
  const [selectedType, setSelectedType] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const canReview = ['ADMIN', 'PROJECT_MANAGER'].includes(user?.role);

  const { data: cardsPage, isLoading } = useQuery({
    queryKey: ['memory-cards', projectId, selectedType],
    queryFn: () => memoryApi.getCards(projectId, { type: selectedType || undefined, status: 'APPROVED', page: 0, size: 50 }),
  });

  const { data: reviewCount } = useQuery({
    queryKey: ['memory-review-count', projectId],
    queryFn: () => memoryApi.getReviewQueue(projectId).then((cards) => cards.length),
    enabled: canReview,
  });

  const cards = cardsPage?.content || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Brain size={20} className="text-purple-600" />
            Project Memory
          </h2>
          {canReview && reviewCount > 0 && (
            <button
              onClick={() => setView(view === 'review' ? 'cards' : 'review')}
              className="flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-orange-200 transition-colors"
            >
              {reviewCount} pending review
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canReview && (
            <button
              onClick={() => setView(view === 'review' ? 'cards' : 'review')}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {view === 'review' ? 'View Cards' : 'Review Queue'}
            </button>
          )}
          <Button size="sm" onClick={() => setShowCreateForm(true)}>
            <Plus size={14} className="mr-1" /> Add Card
          </Button>
        </div>
      </div>

      {view === 'review' && canReview ? (
        <ReviewQueue projectId={projectId} />
      ) : (
        <>
          {/* Type filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedType('')}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                !selectedType ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {ALL_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type === selectedType ? '' : type)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                  selectedType === type
                    ? TYPE_COLORS[type]
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : cards.length === 0 ? (
            <EmptyState
              icon={<Brain size={40} />}
              title="No memory cards yet"
              description="Memory cards capture important project knowledge from meetings, documents, and decisions."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard(selectedCard?.id === card.id ? null : card)}
                  className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[card.type]}`}>
                      {card.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">{card.visibility}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">{card.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{card.content}</p>
                  {card.sourceReference && (
                    <p className="text-xs text-gray-400 mt-2 truncate">📎 {card.sourceReference}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Side panel for card detail */}
          {selectedCard && (
            <div className="mt-4">
              <MemoryCardDetail
                projectId={projectId}
                cardId={selectedCard.id}
                onClose={() => setSelectedCard(null)}
              />
            </div>
          )}
        </>
      )}

      {/* Create form modal */}
      <MemoryCardForm
        projectId={projectId}
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
      />
    </div>
  );
}
