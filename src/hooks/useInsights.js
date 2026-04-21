import { useState, useCallback } from 'react';
import api from '../services/api.js'; // shared axios instance — JWT token auto-injected

export function useInsights(location, context) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cached, setCached] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [provider, setProvider] = useState('openai');
  const [isVisible, setIsVisible] = useState(false);

  const runGenerate = useCallback(
    async (forceRegenerate = false) => {
      // If we already have insights and aren't forcing a regen, just show them
      if (insights && !forceRegenerate) {
        setIsVisible(true);
        return;
      }

      setLoading(true);
      setError(null);
      setIsVisible(true);

      try {
        const { data } = await api.post('/insights', {
          location,
          context,
          provider,
          forceRegenerate,
        });
        setInsights(data.insights);
        setCached(data.cached);
        setParseError(data.parseError);
      } catch (err) {
        const status = err?.response?.status;
        let message = 'Failed to generate insights. Please try again.';
        if (status === 503) message = 'AI analysis is not available. Contact your administrator.';
        else if (status === 502) message = 'AI provider error. Please try again in a moment.';
        else if (status === 401) message = 'Please log in to generate insights.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [location, context, provider, insights]
  );

  return {
    insights,
    loading,
    error,
    cached,
    parseError,
    provider,
    setProvider,
    generate:   useCallback(() => runGenerate(false), [runGenerate]),
    regenerate: useCallback(() => runGenerate(true),  [runGenerate]),
    dismiss:    useCallback(() => setIsVisible(false), []),
    isVisible,
  };
}
