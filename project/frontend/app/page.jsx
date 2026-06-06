'use client';

import { useState, useEffect } from 'react';
import { useGlobal } from '../lib/GlobalContext';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-track" />
    </label>
  );
}

export default function Dashboard() {
  const { settings, updateSettings, loading } = useGlobal();
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API}/api/logs`);
      setLogs(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const iv = setInterval(fetchLogs, 6000);
    return () => clearInterval(iv);
  }, []);

  const clearLogs = async () => {
    await fetch(`${API}/api/logs`, { method: 'DELETE' });
    setLogs([]);
  };

  const controls = [
    { key: 'buttons_disabled', label: 'DISABLE ALL BUTTONS',  desc: 'Buttons on all nodes are deactivated' },
    { key: 'inputs_disabled',  label: 'LOCK ALL INPUTS',      desc: 'Input fields on all nodes are locked' },
    { key: 'tables_hidden',    label: 'HIDE ALL REGISTRIES',  desc: 'Data tables on all nodes are hidden' },
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="page-subtitle">GLOBAL SYSTEM CONTROL</div>

      {/* Global Controls */}
      <div className="card">
        <div className="card-title">Override Panel</div>
        {loading ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>LOADING...</p>
        ) : (
          controls.map(({ key, label, desc }) => (
            <div className="toggle-row" key={key}>
              <div className="toggle-label">
                <strong>{label}</strong>
                <br />
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>{desc}</span>
              </div>
              <Toggle
                checked={Boolean(settings[key])}
                onChange={e => updateSettings({ [key]: e.target.checked })}
              />
            </div>
          ))
        )}
      </div>

      {/* Status */}
      <div className="card">
        <div className="card-title">System Status</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className={`badge ${settings.buttons_disabled ? 'badge-warn' : 'badge-ok'}`}>
            BTN: {settings.buttons_disabled ? 'DISABLED' : 'ACTIVE'}
          </span>
          <span className={`badge ${settings.inputs_disabled ? 'badge-warn' : 'badge-ok'}`}>
            INP: {settings.inputs_disabled ? 'LOCKED' : 'ACTIVE'}
          </span>
          <span className={`badge ${settings.tables_hidden ? 'badge-warn' : 'badge-ok'}`}>
            TBL: {settings.tables_hidden ? 'HIDDEN' : 'VISIBLE'}
          </span>
        </div>
      </div>

      {/* Error Logs */}
      <div className="card">
        <div className="card-title" style={{ justifyContent: 'space-between' }}>
          <span>// Event Log — SQLite</span>
          <button className="btn btn-ghost" style={{ padding: '0.2rem 0.6rem', fontSize: '0.65rem' }} onClick={clearLogs}>
            [ CLEAR ]
          </button>
        </div>
        {logsLoading ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>LOADING...</p>
        ) : logs.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            // No events recorded
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Node</th>
                  <th>Field</th>
                  <th>Message</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--muted)' }}>{log.id}</td>
                    <td><span className="badge badge-warn">{log.page}</span></td>
                    <td style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{log.field_name}</td>
                    <td>{log.message}</td>
                    <td style={{ color: 'var(--muted)', fontSize: '0.68rem' }}>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
