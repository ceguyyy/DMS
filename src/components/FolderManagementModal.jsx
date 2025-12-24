import React, { useState } from 'react';

const FolderManagementModal = ({ isOpen, onClose, onAddFolder, onDeleteFolder, documents = [], manualFolders = [] }) => {
    const [activeTab, setActiveTab] = useState('BUILDING'); // BUILDING, LEVEL, RACK
    const [newItemName, setNewItemName] = useState('');

    if (!isOpen) return null;

    // Helper to get list of items for current tab
    const getExistingItems = () => {
        const typeKeyMap = {
            'BUILDING': 'building',
            'LEVEL': 'level',
            'RACK': 'rack'
        };
        const key = typeKeyMap[activeTab];

        // Safety check for documents array
        const safeDocs = Array.isArray(documents) ? documents : [];
        const systemSet = new Set(safeDocs.map(d => d.physicalLocation?.[key]).filter(Boolean));

        const safeManual = Array.isArray(manualFolders) ? manualFolders : [];
        const manualSet = new Set(safeManual.filter(f => f.type === activeTab).map(f => f.name));

        // Merge and tag them
        const combined = [];
        systemSet.forEach(name => combined.push({ name, source: 'SYSTEM' }));
        manualSet.forEach(name => {
            if (!systemSet.has(name)) combined.push({ name, source: 'MANUAL' });
        });

        return combined.sort((a, b) => a.name.localeCompare(b.name));
    };

    const existingItems = getExistingItems();

    const handleAdd = () => {
        if (!newItemName.trim()) return;
        onAddFolder(activeTab, newItemName);
        setNewItemName('');
    };

    const handleDelete = (item) => {
        if (item.source === 'SYSTEM') {
            alert(`Cannot delete "${item.name}" because it contains documents. Please move or delete the documents first.`);
            return;
        }
        if (confirm(`Delete folder "${item.name}"?`)) {
            if (onDeleteFolder) onDeleteFolder(activeTab, item.name);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{ background: 'white', borderRadius: '12px', width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Manage Digital Archive Structure</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB' }}>
                    {['BUILDING', 'LEVEL', 'RACK'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1, padding: '12px',
                                background: activeTab === tab ? '#EFF6FF' : 'white',
                                color: activeTab === tab ? '#2563EB' : '#6B7280',
                                border: 'none', borderBottom: activeTab === tab ? '2px solid #2563EB' : 'none',
                                cursor: 'pointer', fontWeight: 600
                            }}
                        >
                            {tab}s
                        </button>
                    ))}
                </div>

                <div style={{ padding: '24px', overflowY: 'auto' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Add New {activeTab}</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                className="form-input"
                                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                                placeholder={`Enter ${activeTab.toLowerCase()} name...`}
                                value={newItemName}
                                onChange={e => setNewItemName(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={handleAdd}>Add</button>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '14px', marginBottom: '12px', color: '#374151' }}>Existing {activeTab}s</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {existingItems.map(item => (
                                <div key={item.name} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '8px 12px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB'
                                }}>
                                    <span style={{ fontSize: '13px', fontWeight: 500 }}>{item.name}</span>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        {item.source === 'SYSTEM' && <span style={{ fontSize: '10px', color: '#9CA3AF', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px' }}>System</span>}
                                        <button
                                            onClick={() => handleDelete(item)}
                                            style={{
                                                border: 'none', background: 'none', cursor: 'pointer',
                                                color: item.source === 'SYSTEM' ? '#D1D5DB' : '#EF4444',
                                                fontSize: '16px'
                                            }}
                                            title={item.source === 'SYSTEM' ? "Contains documents (Cannot delete)" : "Delete folder"}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {existingItems.length === 0 && <div style={{ color: '#9CA3AF', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center', padding: '10px' }}>No items found.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FolderManagementModal;
