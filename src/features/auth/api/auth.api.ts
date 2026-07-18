import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

interface EmployeeData {
  id: string;
  role_id: string;
  branch_id: string;
  employee_code: string;
  name: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}

function apiError<T>(message: string, code: string, status: number): ApiResponse<T> {
  return { data: null, error: { message, code, status } };
}

function apiOk<T>(data: T): ApiResponse<T> {
  return { data, error: null };
}

export async function fetchEmployeeByUserId(userId: string): Promise<ApiResponse<EmployeeData>> {
  try {
    const result = await supabase
      .from('employees')
      .select('id, role_id, branch_id, employee_code, name')
      .eq('user_id', userId)
      .eq('is_active', true)
      .is('deleted_at', null)
      .maybeSingle();

    const { data, error } = result as unknown as { data: EmployeeData | null; error: { message: string; status?: number } | null };

    if (error) {
      return apiError('فشل جلب بيانات الموظف', 'EMPLOYEE_FETCH_FAILED', error.status ?? 500);
    }

    if (!data) {
      return apiError('الموظف غير موجود', 'EMPLOYEE_NOT_FOUND', 404);
    }

    return apiOk(data);
  } catch {
    return apiError('فشل جلب بيانات الموظف', 'NETWORK_ERROR', 500);
  }
}

export async function fetchRolePermissions(roleId: string): Promise<ApiResponse<string[]>> {
  try {
    const result = await supabase
      .from('role_permissions')
      .select('permissions(code)')
      .eq('role_id', roleId);

    const { data, error } = result as unknown as { data: { permissions: { code: string } | null }[] | null; error: { message: string; status?: number } | null };

    if (error) {
      return apiError('فشل جلب الصلاحيات', 'PERMISSION_FETCH_FAILED', error.status ?? 500);
    }

    const permissions: string[] = (data ?? []).map((rp) => rp.permissions?.code).filter(Boolean) as string[];
    return apiOk(permissions);
  } catch {
    return apiError('فشل جلب الصلاحيات', 'NETWORK_ERROR', 500);
  }
}

export async function fetchCompanyId(): Promise<ApiResponse<string>> {
  try {
    const result = await supabase
      .from('settings')
      .select('company_id')
      .is('branch_id', null)
      .maybeSingle();

    const { data, error } = result as unknown as { data: { company_id: string } | null; error: { message: string; status?: number } | null };

    if (error) {
      return apiError('فشل جلب بيانات الشركة', 'COMPANY_FETCH_FAILED', error.status ?? 500);
    }

    return apiOk(data?.company_id ?? '');
  } catch {
    return apiError('فشل جلب بيانات الشركة', 'NETWORK_ERROR', 500);
  }
}

export async function fetchUserById(userId: string): Promise<ApiResponse<UserData>> {
  try {
    const result = await supabase
      .from('users')
      .select('id, name, email, avatar_url')
      .eq('id', userId)
      .maybeSingle();

    const { data, error } = result as unknown as { data: UserData | null; error: { message: string; status?: number } | null };

    if (error) {
      return apiError('فشل جلب بيانات المستخدم', 'USER_FETCH_FAILED', error.status ?? 500);
    }

    if (!data) {
      return apiError('المستخدم غير موجود', 'USER_NOT_FOUND', 404);
    }

    return apiOk(data);
  } catch {
    return apiError('فشل جلب بيانات المستخدم', 'NETWORK_ERROR', 500);
  }
}
