'use client';

import { useState, useEffect, useRef } from 'react';
import { useGlobal } from '../lib/GlobalContext';

const SAMPLE_DATA = [
  { id: 'A-01', name: 'Alpha Node',  value: '0x1A3F', status: 'ONLINE' },
  { id: 'B-02', name: 'Beta Node',   value: '0x2B7C', status: 'IDLE'   },
  { id: 'G-03', name: 'Gamma Node',  value: '0x3C9D', status: 'ONLINE' },
];

const BUTTONS = [
  { id: 'btn1', label: '[ Execute ]',  variant: 'btn-primary' },
  { id: 'btn2', label: '[ Sync ]',     variant: 'btn-secondary' },
  { id: 'btn3', label: '[ Inspect ]',  variant: 'btn-ghost' },
];

export default function SubPage({ pageName, accent = '#00c8ff', nodeId = '01' }) {
  const { settings, sendErrorLog } = useGlobal();
  const [inputs, setInputs] = useState({ field1: '', field2: '' });
  const [hasError, setHasError] = useState(false);
  const [clickedBtn, setClickedBtn] = useState(null);
  const errorSentRef = useRef({ field1: false, field2: false });

  useEffect(() => {
    const anyError = Object.values(inputs).some(v => v.trim().toUpperCase() === 'ERROR');
    setHasError(anyError);
  }, [inputs]);

  const handleInputChange = async (fieldName, value) => {
    setInputs(prev => ({ ...prev, [fieldName]: value }));
    if (value.trim().toUpperCase() === 'ERROR' && !errorSentRef.current[fieldName]) {
      errorSentRef.current[fieldName] = true;
      await sendErrorLog(pageName, fieldName, `ERROR detected in ${fieldName}`);
    }
    if (value.trim().toUpperCase() !== 'ERROR') {
      errorSentRef.current[fieldName] = false;
    }
  };

  const handleButtonClick = (btnId) => {
    if (settings.buttons_disabled || hasError) return;
    setClickedBtn(btnId);
    setTimeout(() => setClickedBtn(null), 500);
  };

  const btnClass = (base) => `btn ${base}${hasError ? ' btn-error' : ''}`;

  return (
    <div>
      <h1 className="page-title" style={{ color: accent }}>
        {pageName}
      </h1>
      <div className="page-subtitle">
        NODE / {nodeId} &nbsp;·&nbsp; CONTROL INTERFACE
      </div>

      {/* Buttons */}
      <div className="card">
        <div className="card-title">Control Matrix</div>
        {hasError && (
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge badge-warn">⚠ ALERT: ERROR STATE</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--danger)', letterSpacing: '0.08em' }}>
              LOG TRANSMITTED TO SERVER
            </span>
          </div>
        )}
        <div className="btn-row">
          {BUTTONS.map(({ id, label, variant }) => (
            <button
              key={id}
              className={btnClass(variant)}
              disabled={settings.buttons_disabled}
              onClick={() => handleButtonClick(id)}
            >
              {clickedBtn === id ? '[ OK ✓ ]' : label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="card">
        <div className="card-title">Input Parameters</div>
        <div className="input-row">
          {['field1', 'field2'].map((field, i) => (
            <div className="input-group" key={field}>
              <label className="input-label">
                PARAM_{i === 0 ? 'ALPHA' : 'BETA'}
              </label>
              <input
                className={`input${inputs[field].trim().toUpperCase() === 'ERROR' ? ' input-error' : ''}`}
                type="text"
                placeholder={`_`}
                value={inputs[field]}
                disabled={settings.inputs_disabled}
                onChange={e => handleInputChange(field, e.target.value)}
              />
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          // Input <span style={{ color: 'var(--danger)' }}>ERROR</span> triggers alert protocol
        </p>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-title">Node Registry</div>
        {settings.tables_hidden ? (
          <div className="table-hidden-msg">
            <span style={{ color: 'var(--muted)' }}>//</span>
            REGISTRY HIDDEN — GLOBAL OVERRIDE ACTIVE
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Node</th>
                  <th>Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_DATA.map(row => (
                  <tr key={row.id}>
                    <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{row.id}</td>
                    <td>{row.name}</td>
                    <td style={{ color: accent, fontFamily: 'var(--font-mono)' }}>{row.value}</td>
                    <td>
                      <span className={`badge ${row.status === 'ONLINE' ? 'badge-ok' : ''}`}
                        style={row.status !== 'ONLINE' ? { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--muted)' } : {}}>
                        {row.status}
                      </span>
                    </td>
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
