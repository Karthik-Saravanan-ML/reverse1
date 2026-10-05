import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();
  
  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    updateUser,
    hasRole: (role) => user?.role === role || user?.roles?.includes(role)
  };
};
