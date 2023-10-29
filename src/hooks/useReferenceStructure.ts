import { useCallback, useEffect, useMemo, useState } from 'react';
import { VERBOSITY } from '../lib/constants';
import { TRequest, TResponseReferenceStructure } from '../models/models';
import useClient from './useClient';

export const useReferenceStructure = () => {
  const { fetchMe, loading, error } = useClient(VERBOSITY.NORMAL);
  const [data, setData] = useState<TResponseReferenceStructure | null>(null);

  const request: TRequest = useMemo(() => {
    return {
      method: 'GET',
      path: `/api/reference/structure`
    };
  }, []);

  const getReferenceStructure = useCallback(
    async (request: TRequest) => {
      const data: TResponseReferenceStructure = await fetchMe(request);
      setData(data);
    },
    [fetchMe]
  );

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getReferenceStructure(request);
    }
    return () => {
      mounted = false;
    };
  }, [getReferenceStructure, request]);

  return {
    data,
    loading,
    error
  };
};
