import React, { useState } from 'react';

const AuditTrail = ({ data }) => {
    const [filter, setFilter] = useState('');

    const filteredLogs = data.filter(log =>
        log.user.toLowerCase().includes(filter.toLowerCase()) ||
        log.action.toLowerCase().includes(filter.toLowerCase())
    );


    const [selectedLog, setSelectedLog] = useState(null);

    return (
        <div style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>System Audit Trail</h2>
                    <p style={{ color: 'var(--text-sub)', fontSize: '13px', marginTop: '4px' }}>Immutable log of all system transactions and user activities.</p>
                </div>
                <input
                    type="text"
                    className="form-input"
                    style={{ width: '300px' }}
                    placeholder="Filter by user or action..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>User / Service</th>
                            <th>Action Event</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => (
                            <tr
                                key={log.id}
                                onClick={() => setSelectedLog(log)}
                                style={{ cursor: 'pointer' }}
                                className="table-row-hover"
                            >
                                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{log.time}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#6b7280' }}>
                                            {log.user.charAt(0)}
                                        </div>
                                        {log.user}
                                    </div>
                                </td>
                                <td>
                                    <span style={{
                                        background: log.action.includes('ERROR') ? '#FEF2F2' : '#F0FDFA',
                                        color: log.action.includes('ERROR') ? '#B91C1C' : '#0F766E',
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600
                                    }}>
                                        {log.action}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--text-sub)' }}>{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedLog && (
                <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginTop: 0 }}>Log Details</h3>
                        <div style={{ display: 'grid', gap: '12px', fontSize: '13px' }}>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-sub)', marginBottom: '4px' }}>Log ID</label>
                                <div style={{ fontFamily: 'monospace' }}>{selectedLog.id}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-sub)', marginBottom: '4px' }}>Timestamp</label>
                                <div>{selectedLog.time}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-sub)', marginBottom: '4px' }}>User / Service</label>
                                <div>{selectedLog.user}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-sub)', marginBottom: '4px' }}>Action</label>
                                <div>{selectedLog.action}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: 'var(--text-sub)', marginBottom: '4px' }}>Full Details</label>
                                <div style={{ background: '#F9FAFB', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                    {selectedLog.details}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" onClick={() => setSelectedLog(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditTrail;
