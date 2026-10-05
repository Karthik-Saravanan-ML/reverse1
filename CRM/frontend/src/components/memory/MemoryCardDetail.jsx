import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { memoryApi } from '../../api/memoryApi';
import { Clock, CheckCircle, XCircle, Edit2, FileText, Link2, History } from 'lucide-react';
import Spinner from '../ui/Spinner';
import { format } from 'date-fns';

const TYPE_COLORS = {
  REQUIREMENT: 'bg-blue-50 border-blue-200 text-blue-800',
  DECISION: 'bg-purple-50 border-purple-200 text-purple-800',
  APPROVAL: 'bg-green-50 border-green-200 text-green-800',
  ACTION: 'bg-orange-50 border-orange-200 text-orange-800',
  QUESTION: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  RISK: 'bg-red-50 border-red-200 text-red-800',
  ISSUE: 'bg-rose-50 border-rose-200 text-rose-800',
  CHANGE_REQUEST: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  CLIENT_FEEDBACK: 'bg-teal-50 border-teal-200 text-teal-800',
};

const STATUS_CONFIG = {
  PENDING_REVIEW: { icon: Clock, color: 'text-orange-500', label: 'Pending Review' },
  APPROVED: { icon: CheckCircle, color: 'text-green-500', label: 'Approved' },
  EDITED: { icon: Edit2, color: 'text-blue-500', label: 'Approved (Edited)' },
  REJECTED: { icon: XCircle, color: 'text-red-500', label: 'Rejected' },
};

export default function MemoryCardDetail({ projectId, cardId, onClose }) {
  const [activeTab, setActiveTab] = useState('content');

  const { data: card, isLoading } = useQuery({
    queryKey: ['memory-card', projectId, cardId],
    queryFn: () => memoryApi.getCard(projectId, cardId),
    enabled: !!cardId,
  });

  const { data: versions } = useQuery({
    queryKey: ['memory-card-versions', cardId],
    queryFn: () => memoryApi.getCardVersions(projectId, cardId),
    enabled: activeTab === 'versions' && !!cardId,
  });

  const { data: relations } = useQuery({
    queryKey: ['memory-card-relations', cardId],
    queryFn: () => memoryApi.getCardRelations(projectId, cardId),
    enabled: activeTab === 'relations' && !!cardId,
  });

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;
  if (!card) return null;

  const typeStyle = TYPE_COLORS[card.type] || 'bg-gray-50 border-gray-200 text-gray-800';
  const statusConfig = STATUS_CONFIG[card.reviewStatus] || STATUS_CONFIG.PENDING_REVIEW;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b ${typeStyle}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                {card.type.replace('_', ' ')}
              </span>
              <span className="text-xs opacity-60">v{card.version}</span>
            </div>
            <h3 className="font-semibold text-lg leading-tight">{card.title}</h3>
            {card.sourceReference && (
              <p className="text-sm opacity-70 mt-0.5 flex items-center gap-1">
                <FileText size={12} />
                {card.sourceReference}
              </p>
            )}
          </div>
          <div className={`flex items-center gap-1 ${statusConfig.color} flex-shrink-0`}>
            <StatusIcon size={16} />
            <span className="text-xs font-medium">{statusConfig.label}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {['content', 'versions', 'relations'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'versions' ? 'History' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{card.content}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 border-t pt-3">
              <div>
                <span className="font-medium">Extraction:</span> {card.extractionMethod}
              </div>
              {card.confidenceScore && (
                <div>
                  <span className="font-medium">Confidence:</span> {Math.round(card.confidenceScore * 100)}%
                </div>
              )}
              <div>
                <span className="font-medium">Visibility:</span> {card.visibility}
              </div>
              {card.eventDate && (
                <div>
                  <span className="font-medium">Event Date:</span> {format(new Date(card.eventDate), 'MMM d, yyyy')}
                </div>
              )}
              <div>
                <span className="font-medium">Created:</span> {format(new Date(card.createdAt), 'MMM d, yyyy HH:mm')}
              </div>
              {card.reviewedAt && (
                <div>
                  <span className="font-medium">Reviewed:</span> {format(new Date(card.reviewedAt), 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="space-y-3">
            {versions?.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No version history</p>
            )}
            {versions?.map((v) => (
              <div key={v.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span className="font-medium">Version {v.version}</span>
                  <span>{format(new Date(v.editedAt), 'MMM d, yyyy HH:mm')}</span>
                </div>
                {v.editReason && (
                  <p className="text-xs text-blue-600 italic mb-2">Reason: {v.editReason}</p>
                )}
                <p className="text-sm text-gray-700 line-clamp-3">{v.content}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'relations' && (
          <div className="space-y-2">
            {relations?.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No related cards</p>
            )}
            {relations?.map((rel) => (
              <div key={rel.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg text-sm">
                <Link2 size={14} className="text-gray-400" />
                <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{rel.relationshipType}</span>
                <span className="font-medium truncate">{rel.targetCard?.title}</span>
                <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{rel.targetCard?.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
