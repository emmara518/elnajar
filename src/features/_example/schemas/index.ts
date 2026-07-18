import { z } from 'zod';

export const exampleStatusSchema = z.enum(['active', 'inactive', 'archived']);

export const createExampleSchema = z.object({
  name: z
    .string()
    .min(1, 'الاسم مطلوب')
    .max(100, 'الاسم يجب أن لا يتجاوز 100 حرف'),
  description: z
    .string()
    .min(1, 'الوصف مطلوب')
    .max(500, 'الوصف يجب أن لا يتجاوز 500 حرف'),
  status: exampleStatusSchema,
});

export const updateExampleSchema = createExampleSchema.partial();

export const exampleFilterSchema = z.object({
  status: exampleStatusSchema.optional(),
  search: z.string().optional(),
});

export type CreateExampleFormData = z.infer<typeof createExampleSchema>;
export type UpdateExampleFormData = z.infer<typeof updateExampleSchema>;
export type ExampleFilterFormData = z.infer<typeof exampleFilterSchema>;
