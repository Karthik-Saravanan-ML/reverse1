import { useProjectStore } from '../store/projectStore';

export const useProject = () => {
  const { currentProject, projects, setCurrentProject, setProjects, clearProject } = useProjectStore();
  
  return {
    currentProject,
    projects,
    setCurrentProject,
    setProjects,
    clearProject
  };
};
