/**
 * Project Overview Page - Project information and KPIs
 * T048: Implement the Overview page with project info and delivery progress
 */

import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { getCollection } from '../../data/db';

export default function OverviewPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<any>(null);
    const [deliveryProgress, setDeliveryProgress] = useState(0);

  // Load project data
  useState(() => {
    const allProjects = getCollection<any>('projects');
    const found = allProjects.find(p => p.id === parseInt(id!));
    if (found) {
      setProject(found);
    }
  });

  // Calculate delivery progress
  useState(() => {
    if (project) {
      const deliveries = getCollection<any>('deliveries');
      const projectDeliveries = deliveries.filter(d => d.projectId == id);
      const completed = projectDeliveries.filter(d => d.status === 'Delivered').length;
      const progress = projectDeliveries.length > 0 ? (completed / projectDeliveries.length) * 100 : 0;
      setDeliveryProgress(progress);
    }
  });

  // KPI calculation (not used in UI)
// kpi is defined for reference only

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Project Information</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p><b>Reference No:</b> {project?.refNo}</p>
                <p><b>Name:</b> {project?.name}</p>
                <p><b>Agency:</b> {project?.agency}</p>
                <p><b>Status:</b> {project?.status}</p>
                <p><b>Keystage:</b> {project?.keystage ? 'Yes' : 'No'}</p>
              </div>
              <div className="col-md-6">
                <p><b>Start Date:</b> {new Date(project?.startDate || '').toLocaleDateString()}</p>
                <p><b>End Date:</b> {new Date(project?.endDate || '').toLocaleDateString()}</p>
                <p><b>Contract Amount:</b> ₱{project?.contractAmount?.toLocaleString()}</p>
                <p><b>ABC:</b> ₱{project?.abc?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Key Performance Indicators</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="text-muted">Contract Amount</h5>
                    <h3 className="mb-0">₱{project?.contractAmount?.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="text-muted">Approved Budget (ABC)</h5>
                    <h3 className="mb-0">₱{project?.abc?.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="text-muted">Outstanding</h5>
                    <h3 className="mb-0">₱{project?.contractAmount - project?.abc || 0?.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="text-muted">Delivery Progress</h5>
                    <h3 className="mb-0">{deliveryProgress.toFixed(1)}%</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
