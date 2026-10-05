import { create } from 'zustand';

export const useProjectStore = create((set, get) => ({
  currentProject: null,
  projects: [],

  setCurrentProject: (project) => set({ currentProject: project }),
  setProjects: (projects) => set({ projects }),
  clearCurrentProject: () => set({ currentProject: null }),
}));
