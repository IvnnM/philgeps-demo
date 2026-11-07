import { useState } from 'react';
import { Peso } from '../../components/Peso';

interface AddProjectModalProps {
  onSave: (project: any) => void;
  onCancel: () => void;
  isAdmin: boolean;
  isEditing?: boolean;
  initialData?: any;
}

/**
 * Add/Edit Project Modal
 * - Reference number, name, agency, contract amount, ABC
 * - Keystage toggle: enabled only when agency is DepEd
 * - Start/end dates validation: endDate >= startDate
 * - Contract amount and ABC required and >= 0
 */
export default function AddProjectModal({ onSave, onCancel, isAdmin, isEditing = false, initialData }: AddProjectModalProps) {
  const [refNo, setRefNo] = useState(initialData?.refNo || '');
  const [name, setName] = useState(initialData?.name || '');
  const [agency, setAgency] = useState<'DepEd' | 'DPWH'>(initialData?.agency || 'DepEd');
  const [contractAmount, setContractAmount] = useState(String(initialData?.contractAmount || ''));
  const [abc, setAbc] = useState(String(initialData?.abc || ''));
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [keystage, setKeystage] = useState(initialData?.keystage || false);
  const [error, setError] = useState('');

  const canEditKeystage = agency === 'DepEd';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!refNo.trim()) {
      setError('Reference number is required');
      return;
    }
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    if (!contractAmount || parseFloat(contractAmount) < 0) {
      setError('Contract amount is required and must be >= 0');
      return;
    }
    if (!abc || parseFloat(abc) < 0) {
      setError('ABC is required and must be >= 0');
      return;
    }
    if (!startDate) {
      setError('Start date is required');
      return;
    }
    if (!endDate) {
      setError('End date is required');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be on or after start date');
      return;
    }
    if (keystage && agency !== 'DepEd') {
      setError('Keystage is only available for DepEd projects');
      return;
    }

    const projectData = {
      refNo: refNo.trim().toUpperCase(),
      name: name.trim(),
      agency,
      contractAmount: parseFloat(contractAmount),
      abc: parseFloat(abc),
      startDate,
      endDate,
      status: 'Ongoing',
      keystage,
    };

    if (isEditing && initialData) {
      onSave({ ...projectData, id: initialData.id });
    } else {
      onSave(projectData);
    }
  };

  return (
    <div className="modal show" style={{ display: 'block', backdropFilter: 'blur(4px)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? 'Edit Project' : 'Add Project'}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Reference Number *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value.toUpperCase())}
                    placeholder="e.g., DEP-2024-001"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Project name"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Agency *</label>
                  <select
                    className="form-select"
                    value={agency}
                    onChange={(e) => {
                      setAgency(e.target.value as 'DepEd' | 'DPWH');
                      setKeystage(false); // Keystage only for DepEd
                    }}
                    required
                  >
                    <option value="DepEd">DepEd (Department of Education)</option>
                    <option value="DPWH">DPWH (Department of Public Works and Highways)</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Keystage (DepEd only)</label>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={keystage}
                      onChange={(e) => setKeystage(e.target.checked)}
                      disabled={!canEditKeystage}
                      style={{ cursor: canEditKeystage ? 'pointer' : 'not-allowed', opacity: canEditKeystage ? 1 : 0.5 }}
                    />
                    <label className="form-check-label">
                      Use Keystage structure
                    </label>
                    {!canEditKeystage && <small className="text-muted">Keystage is only available for DepEd projects</small>}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Contract Amount (Peso) *</label>
                  <Peso
                    value={contractAmount}
                    onChange={(v) => setContractAmount(v)}
                  />
                  <small className="text-muted">Min: 0.00</small>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Approved Budget (ABC) *</label>
                  <Peso
                    value={abc}
                    onChange={(v) => setAbc(v)}
                  />
                  <small className="text-muted">Min: 0.00</small>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    min={startDate}
                  />
                  <small className="text-muted">
                    {startDate && `Min: ${startDate}`}
                  </small>
                </div>
              </div>

              {isAdmin && (
                <div className="mt-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={keystage}
                      onChange={(e) => setKeystage(e.target.checked)}
                      disabled={!canEditKeystage}
                      style={{ cursor: canEditKeystage ? 'pointer' : 'not-allowed', opacity: canEditKeystage ? 1 : 0.5 }}
                    />
                    <label className="form-check-label">
                      <i className="bi bi-key me-1"></i>Enable Keystage
                    </label>
                    {!canEditKeystage && <small className="text-muted">Keystage only for DepEd</small>}
                  </div>
                </div>
              )}
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary" form="project-form">
              <i className="bi bi-save me-2"></i>{isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
