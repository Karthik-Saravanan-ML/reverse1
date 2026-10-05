import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';

export const usePermissions = () => {
  const { user } = useAuthStore();
  const { currentProject } = useProjectStore();

  const hasRole = (roles) => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isTeamLead = () => {
    return currentProject?.team?.some(member => 
      member.userId === user?.id && member.role === 'LEAD'
    ) || false;
  };

  const canAccess = (resource) => {
    if (hasRole('ADMIN')) return true;
    if (hasRole('MANAGER')) return true;
    // Add logic based on requirements
    return true;
  };

  return { hasRole, isTeamLead, canAccess };
};
