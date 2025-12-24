import React, { useState } from 'react';

const MoveDocumentModal = ({ isOpen, onClose, docId, onMove }) => {
    const [target, setTarget] = useState({
        building: '',
        level: '',
        rack: '',
        box: ''
    });

    if (!isOpen) return null;

    const handleMove = () => {
        if (!target.building || !target.level || !target.rack || !target.box) {
            alert('Please specify the full destination path.');
            return;
        }
        onMove(docId, target);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{ background: 'white', borderRadius: '12px', width: '400px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Move Document</h3>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
                    Moving document <b>{docId}</b> to a new physical location.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {['Building', 'Level', 'Rack', 'Box'].map(field => (
                        <div key={field}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                                Target {field}
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                                placeholder={`e.g. ${field === 'Building' ? 'Gedung B' : field === 'Box' ? 'Box 01' : '...'}`}
                                value={target[field.toLowerCase()]}
                                onChange={e => setTarget({ ...target, [field.toLowerCase()]: e.target.value })}
                            />
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button className="btn" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleMove}>Move Here</button>
                </div>
            </div>
        </div>
    );
};

export default MoveDocumentModal;
