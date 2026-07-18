import { z } from 'zod';

export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'يرجى إدخال كلمة للبحث')
    .max(200, 'كلمة البحث طويلة جداً'),
});

export const newsletterSchema = z.object({
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
});

export type SearchFormData = z.infer<typeof searchSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
