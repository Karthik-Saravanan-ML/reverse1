import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingsApi } from '../../api/meetingsApi';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { Brain, Send, CheckCircle } from 'lucide-react';

const NOTE_SECTIONS = [
  { key: 'agenda', label: 'Agenda', placeholder: 'What was planned to be discussed...' },
  { key: 'summary', label: 'Summary', placeholder: 'Overall meeting summary...' },
  { key: 'requirements', label: 'Requirements', placeholder: 'Requirements discussed or confirmed...' },
  { key: 'decisions', label: 'Decisions', placeholder: 'Decisions made during the meeting...' },
  { key: 'approvals', label: 'Approvals', placeholder: 'Items that were formally approved...' },
  { key: 'questions', label: 'Questions', placeholder: 'Open questions raised...' },
  { key: 'actions', label: 'Action Items', placeholder: 'Action items assigned to team members...' },
  { key: 'risks', label: 'Risks', placeholder: 'Risks identified...' },
  { key: 'issues', label: 'Issues', placeholder: 'Issues or blockers raised...' },
  { key: 'followUp', label: 'Follow-up', placeholder: 'Follow-up items for next meeting...' },
];

export default function MeetingNotesEditor({ projectId, meetingId, onClose }) {
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState({});
  const [activeSection, setActiveSection] = useState('agenda');

  const { data: existingNotes, isLoading } = useQuery({
    queryKey: ['meeting-notes', meetingId],
    queryFn: () => meetingsApi.getNotes(projectId, meetingId),
    onSuccess: (data) => {
      if (data) setNotes(data);
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => meetingsApi.saveNotes(projectId, meetingId, notes),
    onSuccess: () => queryClient.invalidateQueries(['meeting-notes', meetingId]),
  });

  const submitToMemoryMutation = useMutation({
    mutationFn: () => meetingsApi.submitToMemory(projectId, meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries(['meeting-notes', meetingId]);
      queryClient.invalidateQueries(['memory-cards', projectId]);
      queryClient.invalidateQueries(['memory-review-queue', projectId]);
    },
  });

  const handleChange = (key, value) => {
    setNotes((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) return (
    <Modal isOpen onClose={onClose} title="Meeting Notes" size="xl">
      <div className="flex justify-center py-8"><Spinner /></div>
    </Modal>
  );

  const isSubmitted = existingNotes?.submittedForMemory;
  const hasContent = Object.values(notes).some((v) => v?.trim());

  return (
    <Modal isOpen onClose={onClose} title="Meeting Notes & Outcomes" size="xl">
      <div className="flex gap-4 h-[70vh]">
        {/* Section nav */}
        <div className="w-40 flex-shrink-0 space-y-1">
          {NOTE_SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`w-full text-left text-xs px-3 py-2 rounded-lg transition-colors ${
                activeSection === s.key
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              } ${notes[s.key]?.trim() ? 'after:content-["•"] after:ml-1 after:text-green-500' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Active section editor */}
        <div className="flex-1 flex flex-col min-h-0">
          {NOTE_SECTIONS.filter((s) => s.key === activeSection).map((section) => (
            <div key={section.key} className="flex flex-col flex-1 min-h-0">
              <label className="text-sm font-semibold text-gray-900 mb-2">{section.label}</label>
              <textarea
                value={notes[section.key] || ''}
                onChange={(e) => handleChange(section.key, e.target.value)}
                placeholder={section.placeholder}
                disabled={isSubmitted}
                className="flex-1 border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div>
          {isSubmitted && (
            <div className="flex items-center gap-1.5 text-green-600 text-sm">
              <CheckCircle size={16} />
              Submitted to project memory
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          {!isSubmitted && (
            <>
              <Button
                variant="secondary"
                onClick={() => saveMutation.mutate()}
                loading={saveMutation.isPending}
              >
                Save Notes
              </Button>
              <Button
                onClick={() => submitToMemoryMutation.mutate()}
                loading={submitToMemoryMutation.isPending}
                disabled={!hasContent}
              >
                <Brain size={14} className="mr-1" />
                Submit to Memory
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
