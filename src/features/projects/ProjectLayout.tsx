/**
 * Project Layout - Project Workspace with Sub-Navigation
 * T047: Implement the project workspace layout and sub-navigation
 */

import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { getCollection } from '../../data/db';

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  const isAdmin = false;

  
  // Get role name
  const getRoleName = () => {
    const s: any[] = getCollection('session');
    return s[0]?.role || 'Viewer';
  };

  // Determine accessible sections
  const getSections = () => {
    const role = getRoleName();
    const nav: { key: string; label: string; icon: string }[] = [
      { key: 'overview', label: 'Overview', icon: 'bi-speedometer' },
    ];

    if (role === 'SuperAdmin' || role === 'OfficeAdmin' || role === 'WarehouseAdmin') {
      nav.push({ key: 'schools', label: 'Schools', icon: 'bi-building' });
      nav.push({ key: 'lots', label: 'Lots', icon: 'bi-archive' });
    }

    if (role === 'SuperAdmin' || role === 'OfficeAdmin') {
      nav.push({ key: 'keystage', label: 'Keystage', icon: 'bi-folder' });
      nav.push({ key: 'items', label: 'Items', icon: 'bi-tag' });
      nav.push({ key: 'packages', label: 'Packages', icon: 'bi-cart' });
      nav.push({ key: 'reports', label: 'Reports', icon: 'bi-bar-chart' });
    }

    if (isAdmin) {
      nav.push({ key: 'deliveries', label: 'Deliveries', icon: 'bi-truck' });
    }

    return nav;
  };

  const sections = getSections();

  return (
    <div className="container-fluid py-3">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 bg-light rounded" style={{ minHeight: 'calc(100vh - 50px)' }}>
          <div className="p-3">
            <h5 className="text-center mb-3">
              <i className="bi bi-folder2-open me-2"></i>Project Workspace
            </h5>
            <nav className="nav flex-column">
              {sections.map((section) => (
                <button
                  key={section.key}
                  className={`nav-link ${activeSection === section.key ? 'active' : ''}`}
                  onClick={() => {
                    setActiveSection(section.key);
                    navigate(`/projects/${id}/${section.key}`);
                  }}
                >
                  <i className={`bi ${section.icon} me-2`}></i>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-10">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>
              <i className="bi bi-folder2-open me-2"></i>Project Workspace
            </h2>
            <div>

            </div>
          </div>

          <div className="card">
            <div className="card-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
