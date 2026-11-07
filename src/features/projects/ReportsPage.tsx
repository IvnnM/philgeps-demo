/**
 * Reports Page - Project report dashboards with charts
 * T054: Implement project report queries and Reports page
 */

import { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import { getCollection } from '../../data/db';
import { calculateProjectReports, getFilteredProjects } from '../../data/queries/projectReports';
import { useParams } from 'react-router-dom';

// Register all chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement);

export default function ReportsPage() {
  const { id } = useParams<{ id: string }>();
    const [projects, setProjects] = useState<any[]>([]);
  const [reportData, setReportData] = useState<any>(null);
  const [selectedChart, setSelectedChart] = useState<'region' | 'lot' | 'status'>('region');

  // Load projects
  useState(() => {
    const allProjects = getCollection<any>('projects');
    const found = allProjects.find(p => p.id === parseInt(id!));
    if (found) {
      setProjects(allProjects);
      // Calculate reports
      const report = calculateProjectReports(allProjects.filter(p => p.projectId == id));
      setReportData(report);
    } else {
      setProjects(allProjects);
    }
  });

  // Re-calculate when projects change
  useEffect(() => {
    if (projects.length > 0) {
      const filtered = getFilteredProjects(projects, undefined, undefined, undefined);
      const report = calculateProjectReports(filtered);
      setReportData(report);
    }
  }, [projects]);

  // Chart data for by region
  const regionChartData = {
    labels: reportData?.byRegion.map((r: any) => r.region) || [],
    datasets: [
      {
        label: 'Contract Amount (₱)',
        data: reportData?.byRegion.map((r: any) => r.contractAmount) || [],
        backgroundColor: reportData?.byRegion.map((_: any, i: number) => {
          const colors = ['#4e79a7', '#f28e2b', '#59a14f', '#e15759', '#76b7b2'];
          return colors[i % colors.length];
        }),
        borderColor: reportData?.byRegion.map((_: any, i: number) => {
          const colors = ['#4e79a7', '#f28e2b', '#59a14f', '#e15759', '#76b7b2'];
          return colors[i % colors.length];
        }),
        borderWidth: 1,
      },
    ],
  };

  // Chart data for by lot
  const lotChartData = {
    labels: reportData?.byLot.map((r: any) => r.lot) || [],
    datasets: [
      {
        label: 'Contract Amount (₱)',
        data: reportData?.byLot.map((r: any) => r.contractAmount) || [],
        backgroundColor: ['#f28e2b'],
        borderColor: ['#f28e2b'],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for by status
  const statusChartData = {
    labels: reportData?.byStatus.map((r: any) => r.status) || [],
    datasets: [
      {
        label: 'Contract Amount (₱)',
        data: reportData?.byStatus.map((r: any) => r.contractAmount) || [],
        backgroundColor: reportData?.byStatus.map((_: any, i: number) => {
          const colors = ['#4e79a7', '#f28e2b', '#59a14f', '#e15759', '#76b7b2'];
          return colors[i % colors.length];
        }),
        borderColor: reportData?.byStatus.map((_: any, i: number) => {
          const colors = ['#4e79a7', '#f28e2b', '#59a14f', '#e15759', '#76b7b2'];
          return colors[i % colors.length];
        }),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Reports</h2>
      </div>

      {/* Report Type Tabs */}
      <div className="card">
        <div className="card-body">
          <nav className="nav">
            <button
              className={`nav-link ${selectedChart === 'region' ? 'active' : ''}`}
              onClick={() => setSelectedChart('region')}
            >
              <i className="bi bi-map me-2"></i>By Region
            </button>
            <button
              className={`nav-link ${selectedChart === 'lot' ? 'active' : ''}`}
              onClick={() => setSelectedChart('lot')}
            >
              <i className="bi bi-box me-2"></i>By Lot
            </button>
            <button
              className={`nav-link ${selectedChart === 'status' ? 'active' : ''}`}
              onClick={() => setSelectedChart('status')}
            >
              <i className="bi bi-check-circle me-2"></i>By Status
            </button>
          </nav>
        </div>
      </div>

      {/* Chart */}
      <div className="card mt-3">
        <div className="card-body">
          <div className="chart-container" style={{ height: '400px', width: '100%' }}>
            {reportData ? (
              (selectedChart === 'region' && (
                <Chart type="bar" data={regionChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              )) ||
              (selectedChart === 'lot' && (
                <Chart type="bar" data={lotChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              )) ||
              (selectedChart === 'status' && (
                <Chart type="bar" data={statusChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              ))
            ) : (
              <div className="text-center text-muted p-4">
                <i className="bi bi-file-earmark-text fs-1"></i>
                <p className="mt-2">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {reportData && (
        <div className="row mt-3">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h6 className="text-muted">Total Contract Amount</h6>
                <h4 className="mb-0">₱{reportData.totalContractAmount.toLocaleString()}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h6 className="text-muted">Total ABC</h6>
                <h4 className="mb-0">₱{reportData.totalABC?.toLocaleString()}</h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h6 className="text-muted">Report Generated</h6>
                <h4 className="mb-0">{new Date().toLocaleDateString()}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
