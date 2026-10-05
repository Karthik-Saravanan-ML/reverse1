import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ragApi } from '../../api/ragApi';
import AIMessage from './AIMessage';
import { Bot, Send, Brain, Loader2 } from 'lucide-react';

export default function AIAssistant({ projectId }) {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);

  const askMutation = useMutation({
    mutationFn: (q) => ragApi.askQuestion({ question: q, projectId }),
    onSuccess: (data) => {
      setConversation((prev) => [
        ...prev,
        {
          type: 'answer',
          content: data.answer,
          sources: data.sources || [],
          question: data.question,
        },
      ]);
    },
    onError: (err) => {
      setConversation((prev) => [
        ...prev,
        {
          type: 'error',
          content: err.response?.data?.message || 'Failed to get an answer. Please try again.',
        },
      ]);
    },
  });

  const handleAsk = () => {
    const q = question.trim();
    if (!q || askMutation.isPending) return;

    setConversation((prev) => [...prev, { type: 'question', content: q }]);
    setQuestion('');
    askMutation.mutate(q);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const SUGGESTED = [
    'What are the key requirements?',
    'What decisions have been made?',
    'What are the open risks?',
    'What are the pending action items?',
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <Brain size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Project AI</h3>
          <p className="text-xs text-gray-500">Ask anything about this project</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.length === 0 && (
          <div>
            <div className="text-center py-6">
              <Bot size={36} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Ask questions about project requirements, decisions, risks, and more.</p>
            </div>
            <div className="space-y-2 mt-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Suggested questions</p>
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuestion(s); handleAsk(); setQuestion(s); }}
                  className="w-full text-left text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 hover:bg-blue-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {conversation.map((item, idx) => (
          <AIMessage key={idx} message={item} />
        ))}

        {askMutation.isPending && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3 flex-shrink-0">
        <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this project..."
            rows={1}
            disabled={askMutation.isPending}
            className="flex-1 bg-transparent text-sm resize-none focus:outline-none max-h-24 overflow-y-auto py-1 px-1 disabled:opacity-50"
          />
          <button
            onClick={handleAsk}
            disabled={!question.trim() || askMutation.isPending}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-1.5">
          Only searches authorized project data
        </p>
      </div>
    </div>
  );
}
