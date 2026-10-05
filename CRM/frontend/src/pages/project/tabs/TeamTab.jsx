import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../../../api/projectsApi';
import { useAuthStore } from '../../../store/authStore';
import UserAvatar from '../../../components/shared/UserAvatar';
import Spinner from '../../../components/ui/Spinner';
import { Crown, Users, Mail } from 'lucide-react';

export default function TeamTab({ projectId, project }) {
  const { user } = useAuthStore();
  const canManage = ['ADMIN', 'PROJECT_MANAGER'].includes(user?.role);

  const { data: team = [], isLoading } = useQuery({
    queryKey: ['project-team', projectId],
    queryFn: () => projectsApi.getProjectTeam(projectId),
  });

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;

  const teamLead = team.find((m) => m.isTeamLead);
  const members = team.filter((m) => !m.isTeamLead);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          Project Team
          <span className="text-sm font-normal text-gray-500">({team.length} members)</span>
        </h2>
      </div>

      {/* Team Lead */}
      {teamLead && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Team Lead</h3>
          <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
            <UserAvatar user={teamLead} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{teamLead.firstName} {teamLead.lastName}</p>
                <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  <Crown size={10} /> Team Lead
                </span>
              </div>
              <p className="text-sm text-gray-500">{teamLead.email}</p>
              {teamLead.jobTitle && <p className="text-xs text-gray-400">{teamLead.jobTitle}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Members */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:border-blue-200 transition-colors">
              <UserAvatar user={member} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{member.email}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    member.memberRole === 'PROJECT_MANAGER' ? 'bg-blue-100 text-blue-700' :
                    member.memberRole === 'CLIENT' ? 'bg-teal-100 text-teal-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {member.memberRole.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
