import { useState, useCallback, useMemo } from 'react';

export interface ApiError {
  message: string;
  status?: number;
}

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export interface UseApiReturn<T, TArgs extends readonly unknown[] = unknown[]> {
  state: ApiState<T>;
  execute: (...args: TArgs) => Promise<T>;
  reset: () => void;
}

export function useApi<T, TArgs extends readonly unknown[] = unknown[]>(
  apiFunction: (...args: TArgs) => Promise<T>
): UseApiReturn<T, TArgs> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: TArgs): Promise<T> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const apiError: ApiError = {
          message: error instanceof Error ? error.message : 'An error occurred',
          status:
            error && typeof error === 'object' && 'status' in error
              ? (error as { status: number }).status
              : undefined,
        };
        setState({ data: null, loading: false, error: apiError });
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      state,
      execute,
      reset,
    }),
    [state, execute, reset]
  );
}

// Specialized hook for CRUD operations
export function useCrudApi<T>() {
  const [state, setState] = useState<ApiState<T[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchAll = useCallback(async (endpoint: string): Promise<T[]> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const result = await response.json();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const apiError: ApiError = {
        message:
          error instanceof Error ? error.message : 'Failed to fetch data',
      };
      setState({ data: null, loading: false, error: apiError });
      throw error;
    }
  }, []);

  const create = useCallback(
    async (
      endpoint: string,
      data: FormData | Record<string, unknown>
    ): Promise<T> => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers:
          data instanceof FormData
            ? {}
            : { 'Content-Type': 'application/json' },
        body: data instanceof FormData ? data : JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to create: ${response.statusText}`);
      }

      return response.json();
    },
    []
  );

  const update = useCallback(
    async (
      endpoint: string,
      data: FormData | Record<string, unknown>
    ): Promise<T> => {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers:
          data instanceof FormData
            ? {}
            : { 'Content-Type': 'application/json' },
        body: data instanceof FormData ? data : JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to update: ${response.statusText}`);
      }

      return response.json();
    },
    []
  );

  const remove = useCallback(async (endpoint: string): Promise<void> => {
    const response = await fetch(endpoint, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete: ${response.statusText}`);
    }
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      state,
      fetchAll,
      create,
      update,
      remove,
      setState,
    }),
    [state, fetchAll, create, update, remove, setState]
  );
}
