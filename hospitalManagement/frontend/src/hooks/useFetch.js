import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';

/**
 * useFetch(url, deps?, axiosOptions?)
 *  - url:         API path (relative to baseURL)
 *  - deps:        array of values that trigger a re-fetch when changed (optional)
 *  - axiosOptions: extra config to pass to axiosClient.get() (optional)
 */
const useFetch = (url, deps = [], axiosOptions = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // start true to avoid flash of empty/error state
  const [error, setError] = useState(null);

  // Stable dep fingerprint so useCallback doesn't re-create on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const depKey = Array.isArray(deps) ? JSON.stringify(deps) : '[]';

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      // axiosClient interceptor returns response.data (the full {success, message, data} wrapper)
      // so `response` here IS already response.data from axios
      // `response.data` is then the actual payload
      const response = await axiosClient.get(url);
      setData(response.data ?? response);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, depKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;