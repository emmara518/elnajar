import type { ApiResponse } from '@/types';
import type { AcceptInviteFormData, InviteFormData } from '../schemas';
import type { AuthUser } from '../types';
import type { InvitationRepository } from '../api';
import { fromDTO } from '../api';

export class InvitationService {
  constructor(private readonly repository: InvitationRepository) {}

  async invite(payload: InviteFormData): Promise<ApiResponse<{ invitedEmail: string; expiresAt: string }>> {
    try {
      const response = await this.repository.invite({
        email: payload.email,
        name: payload.name,
        role_id: payload.roleId,
        branch_id: payload.branchId,
      });

      if (response.error !== null || response.data === null) {
        return { data: null, error: response.error ?? { message: 'فشلت عملية الدعوة', code: 'UNKNOWN', status: 500 } };
      }

      return { data: { invitedEmail: response.data.invited_email, expiresAt: response.data.expires_at }, error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'حدث خطأ في الشبكة';
      return { data: null, error: { message, code: 'NETWORK_ERROR', status: 0 } };
    }
  }

  async acceptInvite(payload: AcceptInviteFormData): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await this.repository.acceptInvite({
        token: payload.token,
        password: payload.password,
        name: payload.name,
      });

      if (response.error !== null || response.data === null) {
        return { data: null, error: response.error ?? { message: 'فشل قبول الدعوة', code: 'UNKNOWN', status: 500 } };
      }

      return { data: fromDTO(response.data), error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'حدث خطأ في الشبكة';
      return { data: null, error: { message, code: 'NETWORK_ERROR', status: 0 } };
    }
  }

  async validateToken(token: string): Promise<ApiResponse<{ valid: boolean; email?: string; name?: string }>> {
    try {
      return await this.repository.validateToken(token);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'حدث خطأ في الشبكة';
      return { data: null, error: { message, code: 'NETWORK_ERROR', status: 0 } };
    }
  }
}
