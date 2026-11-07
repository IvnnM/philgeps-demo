// Pagination utilities for PhilGEPS Tracker Demo
export interface PageData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function getPageData<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
}

export function calculatePagination<T>(items: T[], page: number, pageSize: number): PageData<T> {
  const total = items.length;
  const pagedItems = getPageData(items, page, pageSize);
  return { items: pagedItems, total, page, pageSize };
}
