import { useAuth } from '../auth/AuthContext';
import { getSession } from '../data/db';
import type { Role } from '../data/types';
import { switchRole } from '../auth/AuthContext';
import { clearSession } from '../data/db';
import { useNavigate } from 'react-router-dom';
import { getLandingPage } from '../auth/roles';

export default function RoleSwitcher() {
  const { state, action } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center gap-2">
      <span className="text-muted small me-2">Role:</span>
      <select
        name="role"
        className="form-select form-select-sm"
        value={state.session?.role}
        onChange={(e) => {
          const role = e.target.value as Role;
          const session = getSession();
          switchRole(session, role, action);
          navigate(getLandingPage(role));
        }}
      >
        <option value="SuperAdmin">Super Admin</option>
        <option value="OfficeAdmin">Office Admin</option>
        <option value="WarehouseAdmin">Warehouse Admin</option>
        <option value="Viewer">Viewer</option>
      </select>
      <button
        className="btn btn-outline-secondary btn-sm"
        onClick={() => {
          const session = getSession();
          if (session) {
            clearSession();
            clearSession();
            window.location.href = '/login';
          }
        }}
      >
        <i className="bi bi-box-arrow-right me-1"></i>
      </button>
    </div>
  );
}
