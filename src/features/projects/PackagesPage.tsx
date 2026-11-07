/**
 * Packages Page - List packages with dimensions and contents
 * T053: Implement the Packages area
 */

import { useState } from 'react';
import { getCollection } from '../../data/db';
import { useParams } from 'react-router-dom';

export default function PackagesPage() {
  const { id } = useParams<{ id: string }>();
  const [lots, setLots] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [lotId, setLotId] = useState('');
  const [num, setNum] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [length, setLength] = useState('');
  const [contents, setContents] = useState('');

  // Load lots
  useState(() => {
    const allLots = getCollection<any>('lots');
    setLots(allLots);
  });

  useState(() => {
    const allPackages = getCollection<any>('packages');
    setPackages(allPackages.filter(p => String(p.projectId) === id));
  });

  // Add package
  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!num.trim() || !lotId) return;
    const newPackage = {
      id: Date.now(),
      projectId: parseInt(id!),
      lotId: parseInt(lotId),
      keystageId: 0,
      num: parseInt(num),
      width: parseFloat(width) || 0,
      height: parseFloat(height) || 0,
      length: parseFloat(length) || 0,
      createdAt: new Date().toISOString(),
    };
    setPackages([...packages, newPackage]);
    setNum('');
    setLotId('');
    setWidth('');
    setHeight('');
    setLength('');
    setContents('');
    setShowAddModal(false);
  };

  // Get contents for a package
  const getPackageContents = (packageId: number) => {
    const contents = getCollection<any>('packageContents');
    return contents.filter(pc => pc.packageId == packageId);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Packages</h2>
        <div>
          <button
            className="btn btn-success"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i>Add Package
          </button>
        </div>
      </div>

      {/* Packages Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Package Number</th>
                <th>Dimensions</th>
                <th>Contents</th>
                <th>Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => {
                const contents = getPackageContents(pkg.id);
                return (
                  <tr key={pkg.id}>
                    <td>{pkg.num}</td>
                    <td>
                      {pkg.width || 0}x{pkg.height || 0}x{pkg.length || 0} cm
                    </td>
                    <td>
                      {contents.map((c: any) => c.itemId).join(', ') || '—'}
                    </td>
                    <td>
                      {contents.map((c: any) => c.qty).join(', ') || '—'}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Package Modal */}
      {showAddModal && (
        <div className="modal show" style={{ display: 'block', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Package</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddPackage}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Package Number *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={num}
                        onChange={(e) => setNum(e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Lot *</label>
                      <select
                        className="form-select"
                        value={lotId}
                        onChange={(e) => setLotId(e.target.value)}
                        required
                      >
                        <option value="">Select Lot</option>
                        {Array.from(new Set(lots.map((l: any) => l.id as string))).map((lotId) => (
                          <option key={lotId} value={lotId}>Lot {lotId}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Width (cm)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Height (cm)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Length (cm)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Contents (separate by comma)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={contents}
                        onChange={(e) => setContents(e.target.value)}
                        placeholder="item1, item2, item3"
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
