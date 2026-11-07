import { Outlet, useLocation } from 'react-router-dom';
import { ROLES, IN_SCOPE_NAV } from '../auth/roles';
import { canAccess } from '../auth/roles';
import { getSession, clearSession } from '../data/db';
import { Toast } from '../components/Toast';
import RoleSwitcher from '../demo/RoleSwitcher';

export default function Layout() {
  const location = useLocation();
  const session = getSession();
  const isLoggedIn = !!session;

  const navItems = IN_SCOPE_NAV.filter(item =>
    isLoggedIn ? canAccess(session!.role, item) : item === 'login'
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <i className="bi bi-folder-fill me-2"></i>
            PhilGEPS Tracker
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbars"
            aria-controls="navbars"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbars">
            <ul className="navbar-nav me-auto">
              {navItems.map(item => (
                <li key={item} className="nav-item">
                  <a className={`nav-link ${location.pathname.startsWith(item) ? 'active' : ''}`} href={`/${item}`}>
                    {item === 'users' ? 'Users' : item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
            <div className="d-flex align-items-center">
              {isLoggedIn && (
                <>
                  <span className="text-white me-3">
                    Signed in as <b>{ROLES[session.role].name}</b>
                  </span>
                  <RoleSwitcher />
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => {
                      clearSession();
                      window.location.href = '/login';
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                  </button>
                </>
              )}
              {!isLoggedIn && (
                <>
                  <span className="text-white me-3">Demo logins:</span>
                  <button className="btn btn-outline-light btn-sm" onClick={() => { window.location.href = '/login'; }}>
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container-fluid p-4">
        <Outlet />
      </main>

      <Toast />
    </div>
  );
}
