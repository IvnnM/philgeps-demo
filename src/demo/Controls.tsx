import { useAuth } from '../auth/AuthContext';
import { CONTROLS } from '../auth/roles';

export function Controls({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();
  const isAdmin = CONTROLS.canEditProjects(state.session?.role ?? 'Viewer');
  if (!isAdmin) return null;
  return <>{children}</>;
}
