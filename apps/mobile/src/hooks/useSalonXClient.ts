import { useMemo } from 'react';
import { createSalonXClient } from '@repo/sdk';
import { useAuth } from './useAuth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export function useSalonXClient() {
  const { token } = useAuth();

  return useMemo(() => {
    return createSalonXClient({
      baseUrl: API_BASE_URL,
      apiKey: token || undefined,
    });
  }, [token]);
}
