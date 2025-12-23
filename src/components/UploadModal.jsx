import React, { useState } from 'react';

const UploadModal = ({ isOpen, onClose, onSubmit }) => {
    const [batchName, setBatchName] = useState('Batch-2025-New');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3 style={{ marginTop: 0 }}>Create Upload Batch</h3>
                <div className="form-group">
                    <label className="form-label">Batch Name</label>
                    <input
                        type="text"
                        className="form-input"
                        value={batchName}
                        onChange={(e) => setBatchName(e.target.value)}
                    />
                </div>
                <div style={{ border: '2px dashed var(--primary)', padding: '30px', textAlign: 'center', background: '#F8FAFC', borderRadius: '6px', cursor: 'pointer' }}>
                    <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Click to Upload</div>
                </div>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => onSubmit(batchName)}>Start Processing</button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
