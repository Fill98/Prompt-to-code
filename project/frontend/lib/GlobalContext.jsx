'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const GlobalContext = createContext(null);

export function GlobalProvider({ children }) {
  const [settings, setSettings] = useState({
    buttons_disabled: false,
    inputs_disabled: false,
    tables_hidden: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/global`);
      const data = await res.json();
      setSettings({
        buttons_disabled: Boolean(data.buttons_disabled),
        inputs_disabled: Boolean(data.inputs_disabled),
        tables_hidden: Boolean(data.tables_hidden),
      });
    } catch (e) {
      console.error('Failed to fetch global settings', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    // Poll every 5s so multiple tabs stay in sync
    const interval = setInterval(fetchSettings, 5000);
    return () => clearInterval(interval);
  }, [fetchSettings]);

  const updateSettings = useCallback(async (patch) => {
    // Optimistic update
    setSettings((prev) => ({ ...prev, ...patch }));
    try {
      await fetch(`${API}/api/global`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
    } catch (e) {
      console.error('Failed to update settings', e);
      fetchSettings(); // rollback
    }
  }, [fetchSettings]);

  const sendErrorLog = useCallback(async (page, field_name, message) => {
    try {
      await fetch(`${API}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, field_name, message }),
      });
    } catch (e) {
      console.error('Failed to send log', e);
    }
  }, []);

  return (
    <GlobalContext.Provider value={{ settings, updateSettings, sendErrorLog, loading, refetch: fetchSettings }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal() {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error('useGlobal must be used within GlobalProvider');
  return ctx;
}
