import type { ExampleItem, ExampleSort } from '../types';

export function sortExamples(items: ExampleItem[], sort: ExampleSort, order: 'asc' | 'desc'): ExampleItem[] {
  const sorted = [...items].sort((a, b) => {
    const aValue: string = a[sort];
    const bValue: string = b[sort];
    const comparison = aValue.localeCompare(bValue);
    return order === 'asc' ? comparison : -comparison;
  });
  return sorted;
}

export function filterExamples(items: ExampleItem[], search: string): ExampleItem[] {
  const query = search.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query),
  );
}

export function formatExampleStatus(status: ExampleItem['status']): string {
  const labels: Record<ExampleItem['status'], string> = {
    active: 'نشط',
    inactive: 'غير نشط',
    archived: 'مؤرشف',
  };
  return labels[status];
}
