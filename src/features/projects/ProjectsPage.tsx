import { useState } from 'react';
import AddProjectModal from './AddProjectModal';
import { getCollection } from '../../data/db';
import { addProject, updateProject, deleteProject } from '../../data/queries/projects';
import { CONTROLS } from '../../auth/roles';
import type { Project, Role } from '../../data/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({ year: '', agency: '', status: '' });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const session: any[] = getCollection('session') as any as { role?: string }[];
  const adminRole: Role | undefined = session[0]?.role as Role | undefined;
  const isAdmin = adminRole ? CONTROLS.canEditProjects(adminRole) : false;

  // Load projects
  const loadProjects = () => {
    const allProjects = getCollection<Project>('projects');
    setProjects(allProjects);
    applyFilters();
  };

  // Apply filters
  const applyFilters = () => {
    let result = [...projects];
    
    if (search) {
      result = result.filter(p => 
        p.refNo?.toLowerCase().includes(search.toLowerCase()) ||
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (filters.year) {
      result = result.filter(p => 
        p.startDate?.slice(0, 4) === filters.year
      );
    }
    
    if (filters.agency) {
      result = result.filter(p => p.agency === filters.agency);
    }
    
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setFilteredProjects(result.slice(start, end));
  };

  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value === '' ? undefined : value }));
    setPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ year: '', agency: '', status: '' });
    setSearch('');
    setPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    applyFilters();
  };

  // Get total pages
  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;

  // Status badge class
  function getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'Ongoing': 'warning',
      'Delivered': 'success',
      'Completed': 'info',
      'Cancelled': 'danger',
      'Pending': 'secondary',
    };
    return classes[status] || 'secondary';
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Project Management</h2>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-lg me-2"></i>Add Project
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card mb-3 bg-light">
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              name="year"
              placeholder="Filter by Year"
              value={filters.year || ''}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              name="agency"
              value={filters.agency || ''}
              onChange={handleFilterChange}
            >
              <option value="">All Agencies</option>
              <option value="DepEd">DepEd</option>
              <option value="DPWH">DPWH</option>
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              name="status"
              value={filters.status || ''}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <div className="w-100">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Ref No or Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-outline-secondary ms-2" onClick={resetFilters}>Reset</button>
          </div>
        </div>
      </div>

      {/* Project Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Ref No</th>
                <th>Name</th>
                <th>Agency</th>
                <th>Contract Amount</th>
                <th>ABC</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>{project.refNo}</td>
                  <td>{project.name}</td>
                  <td>{project.agency}</td>
                  <td className="text-text">₱{project.contractAmount.toLocaleString()}</td>
                  <td className="text-text">₱{project.abc?.toLocaleString()}</td>
                  <td>{new Date(project.startDate).toLocaleDateString()}</td>
                  <td>{new Date(project.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge bg-${getStatusBadgeClass(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => setEditingProject(project)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProject(project.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={8} className="text-end">
                  <span className="me-3">Page {page} of {totalPages}</span>
                  <button 
                    className="btn btn-outline-primary btn-sm" 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Prev
                  </button>
                  <button 
                    className="btn btn-outline-primary btn-sm" 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <AddProjectModal
          onSave={(project) => {
            addProject(project);
            loadProjects();
            setShowAddModal(false);
          }}
          onCancel={() => setShowAddModal(false)}
          isAdmin={isAdmin}
        />
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <AddProjectModal
          onSave={(project) => {
            updateProject(editingProject.id, project);
            loadProjects();
            setEditingProject(null);
          }}
          onCancel={() => setEditingProject(null)}
          isAdmin={isAdmin}
          isEditing={true}
          initialData={editingProject}
        />
      )}

      {/* No results */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-4">
          <i className="bi bi-inbox fs-1 text-muted"></i>
          <p className="text-muted">No projects found</p>
        </div>
      )}
    </div>
  );
}
