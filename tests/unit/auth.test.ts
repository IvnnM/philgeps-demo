import { describe, it, expect, beforeEach } from 'vitest';
import { login, switchRole, logout } from '../../src/auth/AuthContext';
import { getSession, setSession, clearSession } from '../../src/data/db';
import { ROLES, canAccess, CONTROLS } from '../../src/auth/roles';
import type { Role } from '../../data/types';

describe('US1: Authentication and Roles', () => {
  beforeEach(() => {
    clearSession();
  });

  describe('Login functionality', () => {
    it('should login as Super Admin', () => {
      const user = login('superadmin@demo.example', 'demo123');
      expect(user).not.toBeNull();
      expect(user!.id).toBe(1);
      expect(user!.role).toBe('SuperAdmin');
    });

    it('should login as Office Admin', () => {
      const user = login('officeadmin@demo.example', 'demo123');
      expect(user).not.toBeNull();
      expect(user!.id).toBe(2);
      expect(user!.role).toBe('OfficeAdmin');
    });

    it('should login as Warehouse Admin', () => {
      const user = login('warehouseadmin@demo.example', 'demo123');
      expect(user).not.toBeNull();
      expect(user!.id).toBe(3);
      expect(user!.role).toBe('WarehouseAdmin');
    });

    it('should login as Viewer', () => {
      const user = login('viewer@demo.example', 'demo123');
      expect(user).not.toBeNull();
      expect(user!.id).toBe(4);
      expect(user!.role).toBe('Viewer');
    });

    it('should reject invalid credentials', () => {
      const result = login('superadmin@demo.example', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should reject unknown email', () => {
      const result = login('unknown@demo.example', 'demo123');
      expect(result).toBeNull();
    });
  });

  describe('Role switching', () => {
    it('should switch Super Admin to Viewer', () => {
      const mockDispatch = (action: any) => {
        if (action.type === 'SWITCH_ROLE') {
          expect(action.role).toBe('Viewer');
        }
      };
      const session = { userId: 1, role: 'SuperAdmin' as Role };
      const result = switchRole(session, 'Viewer', mockDispatch);
      expect(result).toBe(true);
      expect(getSession()!.role).toBe('Viewer');
    });

    it('should switch Viewer to Warehouse Admin', () => {
      setSession({ userId: 4, role: 'Viewer' as Role });
      const mockDispatch = (action: any) => {
        if (action.type === 'SWITCH_ROLE') {
          expect(action.role).toBe('WarehouseAdmin');
        }
      };
      const session = getSession();
      const result = switchRole(session, 'WarehouseAdmin', mockDispatch);
      expect(result).toBe(true);
      expect(getSession()!.role).toBe('WarehouseAdmin');
    });

    it('should reject switch with null session', () => {
      const mockDispatch = () => {};
      const result = switchRole(null, 'Viewer', mockDispatch);
      expect(result).toBe(false);
    });
  });

  describe('Logout', () => {
    it('should clear session', () => {
      // Test logout: the dispatch function should clear the session
      // When logout dispatches LOGOUT, the reducer processes it and calls clearSession()
      // The dispatch function below simulates the real reducer
      let state: any = { user: null, session: null };
      const mockDispatch = (action: any) => {
        if (action.type === 'LOGOUT') {
          localStorage.removeItem('pgd:v1:session');
          state = { user: null, session: null };
        }
        if (action.type === 'SWITCH_ROLE') {
          state.session = { userId: state.user!.id, role: action.role };
        }
        if (action.type === 'LOGIN') {
          state.user = action.user;
          state.session = { userId: action.user.id, role: action.user.role };
        }
      };

      // Seed a session first
      setSession({ userId: 1, role: 'SuperAdmin' as Role });
      expect(getSession()).not.toBeNull();

      // Call logout which dispatches LOGOUT
      logout(mockDispatch);

      // Verify session was cleared
      expect(getSession()).toBeNull();
    });
  });
});

describe('Role-based access control', () => {
  describe('Navigation access', () => {
    it('Super Admin: all nav items accessible', () => {
      expect(canAccess('SuperAdmin', 'dashboard')).toBe(true);
      expect(canAccess('SuperAdmin', 'projects')).toBe(true);
      expect(canAccess('SuperAdmin', 'deliveries')).toBe(true);
      expect(canAccess('SuperAdmin', 'users')).toBe(true);
    });

    it('Office Admin: no users, no deliveries to warehouses', () => {
      expect(canAccess('OfficeAdmin', 'dashboard')).toBe(true);
      expect(canAccess('OfficeAdmin', 'projects')).toBe(true);
      expect(canAccess('OfficeAdmin', 'deliveries')).toBe(true);
      expect(canAccess('OfficeAdmin', 'users')).toBe(false);
    });

    it('Warehouse Admin: only deliveries', () => {
      expect(canAccess('WarehouseAdmin', 'deliveries')).toBe(true);
      expect(canAccess('WarehouseAdmin', 'projects')).toBe(false);
      expect(canAccess('WarehouseAdmin', 'users')).toBe(false);
    });

    it('Viewer: read-only projects and deliveries', () => {
      expect(canAccess('Viewer', 'projects')).toBe(true);
      expect(canAccess('Viewer', 'deliveries')).toBe(true);
      expect(canAccess('Viewer', 'users')).toBe(false);
    });
  });

  describe('Control visibility', () => {
    it('canAddDeliveries', () => {
      expect(CONTROLS.canAddDeliveries('SuperAdmin')).toBe(true);
      expect(CONTROLS.canAddDeliveries('OfficeAdmin')).toBe(true);
      expect(CONTROLS.canAddDeliveries('WarehouseAdmin')).toBe(true);
      expect(CONTROLS.canAddDeliveries('Viewer')).toBe(false);
    });

    it('canSetAccepted: WarehouseAdmin only', () => {
      expect(CONTROLS.canSetAccepted('SuperAdmin')).toBe(false);
      expect(CONTROLS.canSetAccepted('OfficeAdmin')).toBe(false);
      expect(CONTROLS.canSetAccepted('WarehouseAdmin')).toBe(true);
      expect(CONTROLS.canSetAccepted('Viewer')).toBe(false);
    });
  });
});
