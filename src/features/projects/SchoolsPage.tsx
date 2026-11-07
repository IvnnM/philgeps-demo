/**
 * Schools Page - List, add a single school, link to the project
 * T049: Implement the Schools area
 */

import { useState } from 'react';
import { getCollection } from '../../data/db';
import { useParams } from 'react-router-dom';

export default function SchoolsPage() {
  const { id } = useParams();
  const [schools, setSchools] = useState<any[]>([]);
  const [projectSchools, setProjectSchools] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [division, setDivision] = useState('');
  const [region, setRegion] = useState('');

  // Load data on mount
  useState(() => {
    const allSchools = getCollection('schools');
    const allProjectSchools = getCollection('projectSchools');
    setSchools(allSchools);
    setProjectSchools(allProjectSchools);
  });

  // Filtered schools
  const filteredSchools = schools.filter((s: any) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.municipality?.toLowerCase().includes(search.toLowerCase())
  );

  // Add school
  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchool = {
      id: Date.now(),
      name,
      address,
      contactPerson,
      contactNo,
      municipality,
      division,
      region,
    };
    setSchools([...schools, newSchool]);
    setProjectSchools([...projectSchools, { projectId: parseInt(id!), schoolId: String(newSchool.id) }]);
    setShowAddModal(false);
    setName('');
    setAddress('');
    setContactPerson('');
    setContactNo('');
    setMunicipality('');
    setDivision('');
    setRegion('');
  };

  // Get current role
  const getRoleName = (): string => {
    const session: any[] = getCollection('session');
    return session[0]?.role || 'Viewer';
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Check if current user can add
  const canAdd = (['SuperAdmin', 'OfficeAdmin', 'OfficeCoordinator'] as string[]).includes(getRoleName());

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>School List</h2>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            disabled={!canAdd}
          >
            <i className="bi bi-plus-lg me-2"></i>Add School
          </button>
        </div>
      </div>

      {/* School Table */}
      <div className="card">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search schools..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>School Name</th>
                <th>Address</th>
                <th>Contact Person</th>
                <th>Contact No</th>
                <th>Municipality</th>
                <th>Division</th>
                <th>Region</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((school: any, idx: number) => {
                const schoolIdValue: unknown = String(school.id ?? '') || 'new_' + Date.now();
                const existing = projectSchools.find((ps: any) => ps.schoolId == schoolIdValue);
                if (existing) {
                  setProjectSchools(projectSchools.filter((ps: any) => ps.schoolId != schoolIdValue));
                } else {
                                    setProjectSchools([...projectSchools, { projectId: parseInt(id!), schoolId: (schoolIdValue as unknown) as string }]);
                }
                return (
                  <tr key={idx}>
                    <td>{school.name}</td>
                    <td>{school.address}</td>
                    <td>{school.contactPerson}</td>
                    <td>{school.contactNo}</td>
                    <td>{school.municipality}</td>
                    <td>{school.division}</td>
                    <td>{school.region}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                        }}
                      >
                        {projectSchools.find((ps: any) => ps.schoolId == String(school.id || '')) ? 'Linked' : 'Link'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add School Modal */}
      {showAddModal && (
        <div className="modal show" style={{ display: 'block', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add School</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddSchool}>
                  <div className="mb-3">
                    <label className="form-label">School Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Contact Person</label>
                      <input
                        type="text"
                        className="form-control"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Contact No</label>
                      <input
                        type="text"
                        className="form-control"
                        value={contactNo}
                        onChange={(e) => setContactNo(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Municipality</label>
                      <input
                        type="text"
                        className="form-control"
                        value={municipality}
                        onChange={(e) => setMunicipality(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Division</label>
                      <input
                        type="text"
                        className="form-control"
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Region</label>
                      <input
                        type="text"
                        className="form-control"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
