export const EXAMPLE_PAGE_SIZE = 20;

export const EXAMPLE_STATUS_OPTIONS = [
  { value: 'active', label: 'نشط' },
  { value: 'inactive', label: 'غير نشط' },
  { value: 'archived', label: 'مؤرشف' },
] as const;

export const EXAMPLE_SORT_OPTIONS = [
  { value: 'name', label: 'الاسم' },
  { value: 'createdAt', label: 'تاريخ الإنشاء' },
  { value: 'status', label: 'الحالة' },
] as const;

export const EXAMPLE_STORAGE_KEY_PREFIX = 'example' as const;
