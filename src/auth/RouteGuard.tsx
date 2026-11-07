import { Navigate } from 'react-router-dom';
import { getSession } from '../data/db';

interface RouteGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RouteGuard({ allowedRoles, children }: RouteGuardProps) {
  const session = getSession();
  const isLoggedIn = !!session;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes((session!.role as string))) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <h2 className="text-danger">Access Denied</h2>
        <p className="lead">You do not have the required role to view this page.</p>
        <a href="/login" className="btn btn-danger mt-3">Go to Login</a>
      </div>
    );
  }

  return <>{children}</>;
}
