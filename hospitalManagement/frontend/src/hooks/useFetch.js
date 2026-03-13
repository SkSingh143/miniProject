import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get(url, options);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Expose refetch to manually trigger updates (e.g., after deleting an item)
  return { data, loading, error, refetch: fetchData };
};

export default useFetch;