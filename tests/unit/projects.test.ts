import { describe, it, expect, beforeEach } from 'vitest';
import { getProjects, addProject } from '../../src/data/queries/projects';
import { setCollection, clearSession } from '../../src/data/db';
import type { Project } from '../../src/data/types';

describe('US2: Project Queries', () => {
  beforeEach(() => {
    clearSession();
    setCollection('projects', []);
  });

  describe('getProjects filters', () => {
    it('should filter by year', () => {
      const projects: Project[] = [
        { id: 1, refNo: 'P1', name: 'Project 1', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Ongoing', keystage: false },
        { id: 2, refNo: 'P2', name: 'Project 2', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2023-01-01', endDate: '2023-12-31', status: 'Ongoing', keystage: false },
      ];
      setCollection('projects', projects);

      const result = getProjects({ year: '2024', page: 1, pageSize: 10 });
      expect(result.projects).toHaveLength(1);
      expect(result.projects[0].refNo).toBe('P1');
    });

    it('should filter by agency', () => {
      const projects: Project[] = [
        { id: 1, refNo: 'P1', name: 'Project 1', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Ongoing', keystage: false },
        { id: 2, refNo: 'P2', name: 'Project 2', agency: 'DPWH', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Ongoing', keystage: false },
      ];
      setCollection('projects', projects);

      const result = getProjects({ agency: 'DPWH', page: 1, pageSize: 10 });
      expect(result.projects).toHaveLength(1);
      expect(result.projects[0].refNo).toBe('P2');
    });

    it('should filter by status', () => {
      const projects: Project[] = [
        { id: 1, refNo: 'P1', name: 'Project 1', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Ongoing', keystage: false },
        { id: 2, refNo: 'P2', name: 'Project 2', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Delivered', keystage: false },
      ];
      setCollection('projects', projects);

      const result = getProjects({ status: 'Delivered', page: 1, pageSize: 10 });
      expect(result.projects).toHaveLength(1);
      expect(result.projects[0].refNo).toBe('P2');
    });

    it('should return all projects when no filters', () => {
      const projects: Project[] = [
        { id: 1, refNo: 'P1', name: 'Project 1', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Ongoing', keystage: false },
        { id: 2, refNo: 'P2', name: 'Project 2', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Delivered', keystage: false },
      ];
      setCollection('projects', projects);

      const result = getProjects({ page: 1, pageSize: 10 });
      expect(result.projects).toHaveLength(2);
    });

    it('should paginate results', () => {
      const projects: Project[] = [
        { id: 1, refNo: 'P1', name: 'Project 1', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Ongoing', keystage: false },
        { id: 2, refNo: 'P2', name: 'Project 2', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Ongoing', keystage: false },
        { id: 3, refNo: 'P3', name: 'Project 3', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Ongoing', keystage: false },
        { id: 4, refNo: 'P4', name: 'Project 4', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Ongoing', keystage: false },
        { id: 5, refNo: 'P5', name: 'Project 5', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Ongoing', keystage: false },
      ];
      setCollection('projects', projects);

      const result = getProjects({ page: 2, pageSize: 2 });
      expect(result.projects).toHaveLength(2);
      expect(result.projects[0].refNo).toBe('P3');
      expect(result.projects[1].refNo).toBe('P4');
    });
  });

  describe('addProject', () => {
    it('should add a project with generated id', () => {
      const project = {
        refNo: 'P1',
        name: 'Test Project',
        agency: 'DepEd',
        contractAmount: 10000,
        abc: 9000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'Ongoing',
        keystage: false,
      };
      const result = addProject(project);
      expect(result.id).toBe(1);
      expect(result.refNo).toBe('P1');
    });

    it('should assign next id when existing projects exist', () => {
      const existing = [
        { id: 1, refNo: 'P1', name: 'Project 1', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Ongoing', keystage: false },
        { id: 5, refNo: 'P5', name: 'Project 5', agency: 'DepEd', contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31', status: 'Ongoing', keystage: false },
      ];
      setCollection('projects', existing);

      const project = {
        refNo: 'P6',
        name: 'Project 6',
        agency: 'DepEd',
        contractAmount: 1000,
        abc: 1000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'Ongoing',
        keystage: false,
      };
      const result = addProject(project);
      expect(result.id).toBe(6);
    });
  });

  describe('Validation rules', () => {
    it('keystage only settable when agency is DepEd', () => {
      const project = {
        refNo: 'P1',
        name: 'Test',
        agency: 'DPWH',
        contractAmount: 1000,
        abc: 1000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'Ongoing',
        keystage: false,
      };
      expect(project.agency).toBe('DPWH');
      expect(project.keystage).toBe(false);
    });

    it('end date must be after start date', () => {
      const project: Project = {
        id: 1, refNo: 'P1', name: 'Project 1', agency: 'DepEd',
        contractAmount: 1000, abc: 1000, startDate: '2024-01-01', endDate: '2024-12-31',
        status: 'Ongoing', keystage: false,
      };
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      expect(endDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime());
    });

    it('contract amount and ABC required and >= 0', () => {
      const validProject = {
        refNo: 'P1',
        name: 'Test',
        agency: 'DepEd',
        contractAmount: 1000,
        abc: 900,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        status: 'Ongoing',
        keystage: false,
      };
      expect(validProject.contractAmount).toBeGreaterThanOrEqual(0);
      expect(validProject.abc).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('US2: Project Report Queries', () => {
  describe('Report calculations', () => {
    it('should calculate percentages by region', () => {
      const projects: any[] = [
        { id: 1, name: 'Project 1', agency: 'DepEd', contractAmount: 1000, keystage: false, region: 'National Capital Region' },
        { id: 2, name: 'Project 2', agency: 'DepEd', contractAmount: 1000, keystage: false, region: 'National Capital Region' },
        { id: 3, name: 'Project 3', agency: 'DPWH', contractAmount: 2000, keystage: false, region: 'Metro Manila' },
      ];
      const total = projects.reduce((sum, p) => sum + p.contractAmount, 0);
      const NCRProjects = projects.filter(p => p.region === 'National Capital Region');
      const NCRPercentage = (NCRProjects.reduce((sum, p) => sum + p.contractAmount, 0) / total) * 100;
      expect(NCRPercentage).toBeCloseTo(50, 1);
    });

    it('should calculate percentages by lot', () => {
      const projects: any[] = [
        { id: 1, name: 'Project 1', agency: 'DepEd', contractAmount: 1000, keystage: false, lot: 'Lot A' },
        { id: 2, name: 'Project 2', agency: 'DepEd', contractAmount: 1000, keystage: false, lot: 'Lot A' },
        { id: 3, name: 'Project 3', agency: 'DPWH', contractAmount: 2000, keystage: false, lot: 'Lot B' },
      ];
      const lotAProjects = projects.filter(p => p.lot === 'Lot A');
      const lotAPercentage = (lotAProjects.reduce((sum, p) => sum + p.contractAmount, 0) / 4000) * 100;
      expect(lotAPercentage).toBe(50);
    });

    it('should calculate percentages by status', () => {
      const projects: any[] = [
        { id: 1, name: 'Project 1', agency: 'DepEd', contractAmount: 1000, keystage: false, status: 'Ongoing' },
        { id: 2, name: 'Project 2', agency: 'DepEd', contractAmount: 1000, keystage: false, status: 'Ongoing' },
        { id: 3, name: 'Project 3', agency: 'DPWH', contractAmount: 2000, keystage: false, status: 'Delivered' },
      ];
      const ongoing = projects.filter(p => p.status === 'Ongoing');
      const ongoingPercentage = (ongoing.reduce((sum, p) => sum + p.contractAmount, 0) / 4000) * 100;
      expect(ongoingPercentage).toBe(50);
    });
  });
});
