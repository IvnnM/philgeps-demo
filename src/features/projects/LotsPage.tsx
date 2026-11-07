/**
 * Lots Page - List and manage production lots for a project
 * T050: Implement the Lots area
 */

import { useState } from 'react';
import { getCollection } from '../../data/db';
import { useParams } from 'react-router-dom';

export default function LotsPage() {
  const { id } = useParams<{ id: string }>();
  const [lots, setLots] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [lotName, setLotName] = useState('');
  const [contractNo, setContractNo] = useState('');

  // Load lots
  useState(() => {
    const allLots = getCollection<any>('lots');
    setLots(allLots.filter(l => l.projectId == id));
  });

  // Add lot
  const handleAddLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lotName.trim()) return;
    const newLot = {
      id: Date.now(),
      projectId: parseInt(id!),
      lotName,
      contractNo,
    };
    setLots([...lots, newLot]);
    setLotName('');
    setContractNo('');
    setShowAddModal(false);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lot List</h2>
        <div>
          <button
            className="btn btn-success"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i>Add Lot
          </button>
        </div>
      </div>

      {/* Lots Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Lot Number</th>
                <th>Contract No</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot) => (
                <tr key={lot.id}>
                  <td>{lot.lotName}</td>
                  <td>{lot.contractNo}</td>
                  <td>{new Date(lot.createdAt || Date.now()).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => {
                        setLotName(lot.lotName);
                        setContractNo(lot.contractNo);
                        // TODO: Add edit modal
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setLots(lots.filter(l => l.id != lot.id));
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lot Modal */}
      {showAddModal && (
        <div className="modal show" style={{ display: 'block', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Lot</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddLot}>
                  <div className="mb-3">
                    <label className="form-label">Lot Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={lotName}
                      onChange={(e) => setLotName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contract No</label>
                    <input
                      type="text"
                      className="form-control"
                      value={contractNo}
                      onChange={(e) => setContractNo(e.target.value)}
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
    </div>
  );
}
