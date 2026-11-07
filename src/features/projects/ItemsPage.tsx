/**
 * Items Page - List and manage items within a project
 * T052: Implement the Items area with columns Item Name, Unit, Actions
 */

import { useState } from 'react';
import { getCollection } from '../../data/db';
import { useParams } from 'react-router-dom';

export default function ItemsPage() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<any[]>([]);
  const [itemName, setItemName] = useState('');
  const [unit, setUnit] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useState(() => {
    const allItems = getCollection<any>('items');
    setItems(allItems.filter(i => i.projectId == id));
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;
    const newItem = {
      id: Date.now(),
      projectId: parseInt(id!),
      itemName,
      unit,
      supplierCost: 0,
      createdAt: new Date().toISOString(),
    };
    setItems([...items, newItem]);
    setItemName('');
    setUnit('');
    setShowAddModal(false);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Items</h2>
        <div>
          <button
            className="btn btn-success"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-lg me-2"></i>Add Item
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Item Name</th>
                <th>Unit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.itemName}</td>
                  <td>{item.unit}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-pencil"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal show" style={{ display: 'block', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddItem}>
                  <div className="mb-3">
                    <label className="form-label">Item Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
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
