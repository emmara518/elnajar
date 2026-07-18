import { useState } from 'react';
import { inviteSchema } from '../schemas';
import type { InviteFormData } from '../schemas';
import { Button } from '@/design-system';
import { Input } from '@/design-system';
import { Select } from '@/design-system';
import { Card, CardBody, CardHeader } from '@/design-system';
import { Container } from '@/design-system';
import { Stack } from '@/design-system';
import { ROLE_DEFINITIONS } from '../constants';

const BRANCH_OPTIONS = [
  { value: 'branch-1', label: 'الفرع الرئيسي' },
  { value: 'branch-2', label: 'فرع الرياض' },
  { value: 'branch-3', label: 'فرع جدة' },
];

const ROLE_OPTIONS = ROLE_DEFINITIONS
  .filter((r) => r.role !== 'guest')
  .map((r) => ({ value: r.role, label: r.labelAr }));

function InvitePage() {
  const [formData, setFormData] = useState<InviteFormData>({
    email: '',
    name: '',
    roleId: '',
    branchId: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof InviteFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const result = inviteSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof InviteFormData, string>> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof InviteFormData;
        fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); }, 1000);
  };

  const handleChange = (field: keyof InviteFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <Container maxWidth="sm" className="flex min-h-screen items-center justify-center py-12">
        <Card>
          <CardBody>
            <Stack gap="4" className="text-center">
              <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">تم إرسال الدعوة بنجاح</h2>
              <p className="text-gray-600">
                سيتم إرسال دعوة إلى {formData.email} للانضمام إلى النظام
              </p>
              <Button variant="outline" onClick={() => { setIsSuccess(false); setFormData({ email: '', name: '', roleId: '', branchId: '' }); }}>
                دعوة موظف آخر
              </Button>
            </Stack>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className="py-12">
      <Stack gap="6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">دعوة موظف</h1>
          <p className="mt-2 text-gray-600">أرسل دعوة لموظف جديد للانضمام إلى النظام</p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">بيانات الدعوة</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} noValidate>
              <Stack gap="4">
                {submitError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
                    {submitError}
                  </div>
                )}

                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  value={formData.email}
                  onChange={(e) => { handleChange('email', e.target.value); }}
                  error={errors.email}
                  placeholder="أدخل البريد الإلكتروني للموظف"
                  autoComplete="off"
                  autoFocus
                  required
                />

                <Input
                  label="الاسم"
                  type="text"
                  value={formData.name}
                  onChange={(e) => { handleChange('name', e.target.value); }}
                  error={errors.name}
                  placeholder="أدخل اسم الموظف"
                  required
                />

                <Select
                  label="الدور"
                  value={formData.roleId}
                  onChange={(e) => { handleChange('roleId', e.target.value); }}
                  error={errors.roleId}
                  options={[{ value: '', label: 'اختر الدور...' }, ...ROLE_OPTIONS]}
                  required
                />

                <Select
                  label="الفرع"
                  value={formData.branchId}
                  onChange={(e) => { handleChange('branchId', e.target.value); }}
                  error={errors.branchId}
                  options={[{ value: '', label: 'اختر الفرع...' }, ...BRANCH_OPTIONS]}
                  required
                />

                <Button type="submit" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الدعوة'}
                </Button>
              </Stack>
            </form>
          </CardBody>
        </Card>
      </Stack>
    </Container>
  );
}

export default InvitePage;
export { InvitePage };
