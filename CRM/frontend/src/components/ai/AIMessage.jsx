import React, { useState } from 'react';
import { CheckCircle, FileText, Brain, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import SourceReference from './SourceReference';

export default function AIMessage({ item }) {
  const [showSources, setShowSources] = useState(false);

  if (item.type === 'question') {
    return (
      <div className="flex justify-end">
        <div className="bg-blue-600 text-white text-sm rounded-2xl rounded-br-sm px-3 py-2 max-w-[85%]">
          {item.content}
        </div>
      </div>
    );
  }

  if (item.type === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-3 py-2">
        {item.content}
      </div>
    );
  }

  const confidenceColor = 
    item.confidence >= 0.8 ? 'text-green-600' :
    item.confidence >= 0.5 ? 'text-yellow-600' : 'text-red-500';

  return (
    <div className="space-y-2">
      {/* Answer bubble */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2.5">
        <div className="flex items-start gap-2">
          <Brain size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{item.content}</p>
        </div>
      </div>

      {/* Confidence + sources toggle */}
      {item.sources?.length > 0 && (
        <div className="px-1">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${confidenceColor}`}>
              {Math.round((item.confidence || 0) * 100)}% confidence
            </span>
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
            >
              <FileText size={12} />
              {item.sources.length} source{item.sources.length !== 1 ? 's' : ''}
              {showSources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>

          {showSources && (
            <div className="mt-2 space-y-1.5">
              {item.sources.map((src, i) => (
                <SourceReference key={i} source={src} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
