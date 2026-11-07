import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import NotFound from './NotFound';
import DashboardPage from '../features/dashboards/DashboardPage';
import SalesGenerationPage from '../features/dashboards/SalesGenerationPage';
import ProductionPage from '../features/dashboards/ProductionPage';
import LoginPage from '../features/login/LoginPage';
import ProjectsPage from '../features/projects/ProjectsPage';
import ProjectOverviewPage from '../features/projects/OverviewPage';
import DeliveriesPage from '../features/deliveries/DeliveriesPage';
import DeliveryDetailsPage from '../features/deliveries/DeliveryDetailsPage';
import ScanPage from '../features/scan/ScanPage';
import SuccessPage from '../features/scan/SuccessPage';
import UsersPage from '../features/users/UsersPage';
import PrintLayout from '../features/print/PrintLayout';
import ArPage from '../features/print/ArPage';
import LabelsPage from '../features/print/LabelsPage';
import ReportPage from '../features/print/ReportPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="dashboard/sales-generation" element={<SalesGenerationPage />} />
        <Route path="dashboard/production" element={<ProductionPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id/overview" element={<ProjectOverviewPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="deliveries" element={<DeliveriesPage />} />
        <Route path="deliveries/:id" element={<DeliveryDetailsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="scan" element={<ScanPage />} />
        <Route path="scan/success" element={<SuccessPage />} />
        <Route path="print/ar" element={<PrintLayout><ArPage /></PrintLayout>} />
        <Route path="print/labels" element={<PrintLayout><LabelsPage /></PrintLayout>} />
        <Route path="print/reports/:name" element={<PrintLayout><ReportPage /></PrintLayout>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
