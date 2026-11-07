import type { Project } from '../types';
import { getCollection, setCollection } from '../db';
import { getPageData } from '../lib/pagination';

function projectYear(p: Project): string {
  return String(p.startDate?.slice(0, 4) ?? '');
}

export function getProjects(filters: {
  year?: string;
  agency?: 'DepEd' | 'DPWH';
  status?: string;
  page: number;
  pageSize: number;
}) {
  let projects = getCollection<Project>('projects');
  if (filters.year) {
    projects = projects.filter(p => projectYear(p) === filters.year);
  }
  if (filters.agency) {
    projects = projects.filter(p => p.agency === filters.agency);
  }
  if (filters.status) {
    projects = projects.filter(p => p.status === filters.status);
  }
  const total = projects.length;
  const pageData = getPageData<Project>(projects, filters.page, filters.pageSize);
  return { projects: pageData, total, page: filters.page, pageSize: filters.pageSize };
}

export function addProject(project: Omit<Project, 'id'>) {
  const ids = getCollection<Project>('projects').map(p => p.id);
  const id = Math.max(0, ...ids) + 1;
  const newProject = { ...project, id, createdAt: new Date().toISOString() } as Project;
  setCollection('projects', [...getCollection('projects'), newProject]);
  return newProject;
}

export function updateProject(id: number, project: Partial<Project>) {
  const projects = getCollection<Project>('projects');
  const idx = projects.findIndex(p => p.id === id);
  if (idx !== -1) {
    projects[idx] = { ...projects[idx], ...project } as Project;
    setCollection('projects', projects);
  }
  return projects[idx];
}

export function deleteProject(id: number) {
  const projects = getCollection<Project>('projects');
  const filtered = projects.filter(p => p.id !== id);
  setCollection('projects', filtered);
  return filtered;
}
