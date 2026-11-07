import type { Project } from '../types';

// Report calculations for project dashboard
export interface ProjectReportData {
  byRegion: { region: string; percentage: number; contractAmount: number }[];
  byLot: { lot: string; percentage: number; contractAmount: number }[];
  byStatus: { status: string; percentage: number; contractAmount: number }[];
  totalContractAmount: number;
  totalABC: number;
}

/**
 * Calculate report statistics for projects
 * byRegion: distribution of contract amounts by project region/agency
 * byLot: distribution by contract lot
 * byStatus: distribution by project status
 */
export function calculateProjectReports(projects: Project[]): ProjectReportData {
  const totalContractAmount = projects.reduce((sum, p) => sum + p.contractAmount, 0);
  const totalABC = projects.reduce((sum, p) => sum + p.abc, 0);

  // Group by agency (proxy for region in this demo)
  const byAgency: Record<string, number> = {};
  projects.forEach(p => {
    byAgency[p.agency] = (byAgency[p.agency] || 0) + p.contractAmount;
  });

  // Group by status
  const byStatus: Record<string, number> = {};
  projects.forEach(p => {
    byStatus[p.status] = (byStatus[p.status] || 0) + p.contractAmount;
  });

  // Group by keystage (proxy for lot)
  const byLot: Record<string, number> = {};
  projects.forEach(p => {
    byLot[p.keystage ? 'Keystage Projects' : 'Non-Keystage Projects'] = 
      (byLot[p.keystage ? 'Keystage Projects' : 'Non-Keystage Projects'] || 0) + p.contractAmount;
  });

  return {
    byRegion: Object.entries(byAgency).map(([region, amount]) => ({
      region,
      percentage: totalContractAmount > 0 ? (amount / totalContractAmount) * 100 : 0,
      contractAmount: amount,
    })).sort((a, b) => b.contractAmount - a.contractAmount),
    byLot: Object.entries(byLot).map(([lot, amount]) => ({
      lot,
      percentage: totalContractAmount > 0 ? (amount / totalContractAmount) * 100 : 0,
      contractAmount: amount,
    })).sort((a, b) => b.contractAmount - a.contractAmount),
    byStatus: Object.entries(byStatus).map(([status, amount]) => ({
      status,
      percentage: totalContractAmount > 0 ? (amount / totalContractAmount) * 100 : 0,
      contractAmount: amount,
    })).sort((a, b) => b.contractAmount - a.contractAmount),
    totalContractAmount,
    totalABC: totalABC,
  };
}

// Helper: get projects filtered by year, agency, status, sorted by contract amount
export function getFilteredProjects(
  projects: Project[],
  year?: string,
  agency?: 'DepEd' | 'DPWH',
  status?: string,
) {
  return projects.filter(p => {
    if (year && p.startDate?.slice(0, 4) !== year) return false;
    if (agency && p.agency !== agency) return false;
    if (status && p.status !== status) return false;
    return true;
  }).sort((a, b) => b.contractAmount - a.contractAmount);
}
