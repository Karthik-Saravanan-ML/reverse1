import { Navigate, useParams } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';

export default function ProjectRoute({ children }) {
  const { projectId } = useParams();
  const { currentProject } = useProjectStore();
  
  // In a real app, verify the user belongs to the project via API
  if (!projectId) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}
