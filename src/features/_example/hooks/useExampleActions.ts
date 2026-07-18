import { useCallback, useState } from 'react';
import type { CreateExamplePayload, UpdateExamplePayload } from '../types';
import type { ExampleService } from '../services';
import { useExampleStore } from '../stores';

export function useExampleActions(service: ExampleService) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setItems = useExampleStore((state) => state.setItems);
  const setLoading = useExampleStore((state) => state.setLoading);

  const fetchList = useCallback(
    async (params: Parameters<ExampleService['list']>[0]) => {
      setLoading(true);
      try {
        const response = await service.list(params);
        if (response.error !== null) {
          setSubmitError(response.error.message);
          return;
        }
        setItems(response.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
        setSubmitError(message);
      } finally {
        setLoading(false);
      }
    },
    [service, setItems, setLoading],
  );

  const create = useCallback(
    async (payload: CreateExamplePayload): Promise<boolean> => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const response = await service.create(payload);
        if (response.error !== null) {
          setSubmitError(response.error.message);
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
    },
    [service],
  );

  const update = useCallback(
    async (id: string, payload: UpdateExamplePayload): Promise<boolean> => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const response = await service.update(id, payload);
        if (response.error !== null) {
          setSubmitError(response.error.message);
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
    },
    [service],
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const response = await service.delete(id);
        if (response.error !== null) {
          setSubmitError(response.error.message);
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
    },
    [service],
  );

  return {
    isSubmitting,
    submitError,
    fetchList,
    create,
    update,
    remove,
  };
}
