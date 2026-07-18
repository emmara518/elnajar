import { z } from 'zod';
import { emailSchema, passwordSchema } from '@/utils/validation';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
  rememberMe: z.boolean().optional().default(false),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const updatePasswordSchema = z.object({
  token: z.string().min(1, 'رمز إعادة التعيين مطلوب'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمة المرور وتأكيدها غير متطابقين',
  path: ['confirmPassword'],
});

export const inviteSchema = z.object({
  email: emailSchema,
  name: z
    .string()
    .min(1, 'الاسم مطلوب')
    .max(100, 'الاسم يجب أن لا يتجاوز 100 حرف'),
  roleId: z.string().min(1, 'الدور مطلوب'),
  branchId: z.string().min(1, 'الفرع مطلوب'),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(1, 'رمز الدعوة مطلوب'),
  name: z
    .string()
    .min(1, 'الاسم مطلوب')
    .max(100, 'الاسم يجب أن لا يتجاوز 100 حرف'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمة المرور وتأكيدها غير متطابقين',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type InviteFormData = z.infer<typeof inviteSchema>;
export type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;
