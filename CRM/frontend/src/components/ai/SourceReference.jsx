import React from 'react';
import { FileText, Brain, ExternalLink } from 'lucide-react';

export default function SourceReference({ source }) {
  const isDocument = source.type === 'document';
  const Icon = isDocument ? FileText : Brain;
  const bgColor = isDocument ? 'bg-amber-50 border-amber-200' : 'bg-purple-50 border-purple-200';
  const iconColor = isDocument ? 'text-amber-600' : 'text-purple-600';
  const label = isDocument ? 'Document' : 'Memory Card';

  return (
    <div className={`flex items-start gap-2 p-2 rounded-lg border text-xs ${bgColor}`}>
      <Icon size={12} className={`${iconColor} mt-0.5 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className={`font-medium ${iconColor}`}>{label}</span>
          <span className="text-gray-400">{Math.round((source.relevanceScore || 0) * 100)}% match</span>
        </div>
        <p className="font-medium text-gray-800 truncate">{source.title}</p>
        {source.reference && (
          <p className="text-gray-500">{source.reference}</p>
        )}
        {source.snippet && (
          <p className="text-gray-600 mt-0.5 line-clamp-2 italic">"{source.snippet}"</p>
        )}
      </div>
    </div>
  );
}
