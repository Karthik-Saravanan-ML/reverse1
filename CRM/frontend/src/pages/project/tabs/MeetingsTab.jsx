import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingsApi } from '../../../api/meetingsApi';
import { useAuthStore } from '../../../store/authStore';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import EmptyState from '../../../components/ui/EmptyState';
import MeetingNotesEditor from '../../../components/meetings/MeetingNotesEditor';
import { Video, Plus, Calendar, Clock, Users, CheckCircle, ChevronRight } from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';

const STATUS_COLORS = {
  SCHEDULED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
};

function MeetingCard({ meeting, onSelect }) {
  const isPastMeeting = isPast(new Date(meeting.scheduledEndAt));
  return (
    <div
      onClick={() => onSelect(meeting)}
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {format(new Date(meeting.scheduledStartAt), 'MMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {format(new Date(meeting.scheduledStartAt), 'HH:mm')} – {format(new Date(meeting.scheduledEndAt), 'HH:mm')}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[meeting.status]}`}>
            {meeting.status}
          </span>
          {meeting.participants && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Users size={11} />
              {meeting.participants.length}
            </span>
          )}
        </div>
      </div>
      {meeting.notes?.submittedForMemory && (
        <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
          <CheckCircle size={11} />
          Notes submitted to memory
        </div>
      )}
    </div>
  );
}

export default function MeetingsTab({ projectId }) {
  const { user } = useAuthStore();
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const queryClient = useQueryClient();

  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ['meetings', projectId],
    queryFn: () => meetingsApi.getMeetings(projectId),
  });

  const canCreate = ['ADMIN', 'PROJECT_MANAGER', 'EMPLOYEE'].includes(user?.role);

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  const upcoming = meetings.filter((m) => isFuture(new Date(m.scheduledStartAt)));
  const past = meetings.filter((m) => isPast(new Date(m.scheduledStartAt)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Video size={20} className="text-blue-600" />
          Meetings
        </h2>
        {canCreate && (
          <Button size="sm">
            <Plus size={14} className="mr-1" /> Schedule Meeting
          </Button>
        )}
      </div>

      {meetings.length === 0 ? (
        <EmptyState
          icon={<Video size={40} />}
          title="No meetings scheduled"
          description="Schedule meetings to coordinate with your project team and clients"
        />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming</h3>
              <div className="space-y-3">
                {upcoming.map((m) => (
                  <MeetingCard key={m.id} meeting={m} onSelect={setSelectedMeeting} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Past</h3>
              <div className="space-y-3">
                {past.slice(0, 5).map((m) => (
                  <MeetingCard key={m.id} meeting={m} onSelect={setSelectedMeeting} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Meeting detail side panel */}
      {selectedMeeting && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-40 overflow-y-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">{selectedMeeting.title}</h3>
            <button onClick={() => setSelectedMeeting(null)} className="text-gray-400 hover:text-gray-600 p-1">×</button>
          </div>
          <div className="p-4">
            <div className="space-y-3 text-sm mb-4">
              <div className="flex gap-2">
                <Calendar size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium">{format(new Date(selectedMeeting.scheduledStartAt), 'EEEE, MMMM d, yyyy')}</p>
                  <p className="text-gray-500">{format(new Date(selectedMeeting.scheduledStartAt), 'HH:mm')} – {format(new Date(selectedMeeting.scheduledEndAt), 'HH:mm')}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowNotes(true)}
              className="w-full text-sm text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-xl border border-blue-200 transition-colors flex items-center justify-center gap-2"
            >
              View / Edit Meeting Notes
            </button>
          </div>
        </div>
      )}

      {showNotes && selectedMeeting && (
        <MeetingNotesEditor
          projectId={projectId}
          meetingId={selectedMeeting.id}
          onClose={() => setShowNotes(false)}
        />
      )}
    </div>
  );
}
