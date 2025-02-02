import { useCallback, useEffect, useMemo, useState } from 'react';
import useClient from './useClient';
import { VERBOSITY } from '../constants/constants';
import { safeJson } from '../lib/safeJson';

export const useReferenceStructure = () => {
  const { fetchMe, loading, error } = useClient(VERBOSITY.NORMAL);
  const {
    fetchMe: fetchMarkdown,
    loading: loadingMarkdown
    // error: errorMarkdown
  } = useClient(VERBOSITY.SILENT);

  const [data, setData] = useState<TResponseReferenceStructure | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [codified, setcodified] = useState<TStructure>({
    name: '',
    path: '',
    type: 'directory'
  });

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
    const convertCodified = async () => {
      // const dataObj = await JSON.parse(data?.structure || '');
      const dataObj = await safeJson(data?.structure || '');
      if (mounted) {
        setcodified(dataObj);
      }
    };
    convertCodified();
    return () => {
      mounted = false;
    };
  }, [data?.structure]);
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
    error,
    fetchMarkdown,
    loadingMarkdown,
    markdownContent,
    setMarkdownContent,
    codified
  };
};
