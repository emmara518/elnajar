import { useCallback, useState } from 'react';
import type { InvitationService } from '../services';
import type { InviteFormData, AcceptInviteFormData } from '../schemas';

export function useInvitation(service?: InvitationService) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [inviteResult, setInviteResult] = useState<{ invitedEmail: string; expiresAt: string } | null>(null);
  const [tokenValidation, setTokenValidation] = useState<{ valid: boolean; email?: string; name?: string } | null>(null);

  const invite = useCallback(async (payload: InviteFormData): Promise<boolean> => {
    if (!service) {
      setSubmitError('خدمة الدعوة غير متوفرة');
      return false;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setInviteResult(null);

    try {
      const response = await service.invite(payload);
      if (response.error !== null || response.data === null) {
        setSubmitError(response.error?.message ?? 'فشلت عملية الدعوة');
        return false;
      }
      setInviteResult(response.data);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      setSubmitError(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [service]);

  const acceptInvite = useCallback(async (payload: AcceptInviteFormData): Promise<boolean> => {
    if (!service) {
      setSubmitError('خدمة الدعوة غير متوفرة');
      return false;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await service.acceptInvite(payload);
      if (response.error !== null || response.data === null) {
        setSubmitError(response.error?.message ?? 'فشل قبول الدعوة');
        return false;
      }
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
      setSubmitError(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [service]);

  const validateToken = useCallback(async (token: string): Promise<void> => {
    if (!service) return;

    try {
      const response = await service.validateToken(token);
      if (response.error === null && response.data !== null) {
        setTokenValidation(response.data);
      }
    } catch {
      setTokenValidation({ valid: false });
    }
  }, [service]);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setSubmitError(null);
    setInviteResult(null);
    setTokenValidation(null);
  }, []);

  return {
    isSubmitting,
    submitError,
    inviteResult,
    tokenValidation,
    invite,
    acceptInvite,
    validateToken,
    reset,
  };
}
