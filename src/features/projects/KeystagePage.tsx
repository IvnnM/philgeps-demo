/**
 * Keystage Page - Keystage management for a project
 * T051: Implement the Keystage area (only for keystage projects)
 */

import { useState } from 'react';
import { getCollection } from '../../data/db';
import { useParams } from 'react-router-dom';

export default function KeystagePage() {
  const { id } = useParams<{ id: string }>();
  const [keystages, setKeystages] = useState<any[]>([]);
  const [lots, setLots] = useState<any[]>([]);
  const [lotId, setLotId] = useState('');
  const [num, setNum] = useState('');
  const [description, setDescription] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Load lots
  useState(() => {
    const allLots = getCollection<any>('lots');
    setLots(allLots);
  });

  // Load keystages
  useState(() => {
    const allKeystages = getCollection<any>('keystages');
    setKeystages(allKeystages.filter(k => String(k.projectId) === id));
  });

  // Check if project is keystage
  const isKeystageProject = useState(() => {
    const project = getCollection<any>('projects').find(p => p.id == id);
    return project?.keystage === true;
  });

  // Add keystage
  const handleAddKeystage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!num || !lotId) return;
    const newKeystage = {
      id: Date.now(),
      projectId: parseInt(id!),
      lotId: parseInt(lotId),
      num: parseInt(num),
      description,
      createdAt: new Date().toISOString(),
    };
    setKeystages([...keystages, newKeystage]);
    setShowAddModal(false);
    setLotId('');
    setNum('');
    setDescription('');
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Keystage</h2>
        <div>
          {isKeystageProject && (
            <button
              className="btn btn-success"
              onClick={() => setShowAddModal(true)}
            >
              <i className="bi bi-plus-lg me-2"></i>Add Keystage
            </button>
          )}
        </div>
      </div>

      {!isKeystageProject && (
        <div className="alert alert-warning">
          This project is not a keystage project. Keystage management is only available for projects with keystage enabled.
        </div>
      )}

      {isKeystageProject && (
        <>
          <div className="card">
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Keystage No</th>
                    <th>Lot</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {keystages.map((ks) => (
                    <tr key={ks.id}>
                      <td>{ks.num}</td>
                      <td>{ks.lotId || '—'}</td>
                      <td>{ks.description || '—'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showAddModal && (
            <div className="modal show" style={{ display: 'block', backdropFilter: 'blur(4px)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Keystage</h5>
                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleAddKeystage}>
                      <div className="mb-3">
                        <label className="form-label">Keystage Number *</label>
                        <input
                          type="number"
                          className="form-control"
                          value={num}
                          onChange={(e) => setNum(e.target.value)}
                          min="1"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Lot *</label>
                        <select
                          className="form-select"
                          value={lotId}
                          onChange={(e) => setLotId(e.target.value)}
                          required
                        >
                          <option value="">Select Lot</option>
                          {[...new Set(lots.map(l => l.id))].map((lotId) => (
                            <option key={lotId} value={lotId}>Lot {lotId}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <input
                          type="text"
                          className="form-control"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
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
        </>
      )}
    </div>
  );
}
