import React, { useState } from 'react';

const DataPreviewer = ({ data, onBack, onNextDoc, onPrevDoc }) => {
    const [activeTab, setActiveTab] = useState('metadata'); // 'metadata' | 'history'
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const [page, setPage] = useState(1);
    const totalPages = 5; // Mock total pages

    // Minimal PDF Base64 (Hello World) to avoid external block
    const pdfDataUri = "data:application/pdf;base64,JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwogIC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmogICUgcGFnZXMKPDwKICAvVHlwZSAvUGFnZXwKICAvTWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0KPj4KZW5kb2JqCgozIDAgb2JqICA1IHBhZ2UKPDwKICAvVHlwZSAvUGFnZQogIC9QYXJlbnQgMiAwIFIKICAvUmVzb3VyY2VzIDw8CiAgICAvRm9udCA8PAogICAgICAvRjEgNCAwIFIKICAgID4+CiAgPj4KICAvQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCgo0IDAgb2JqICA1IGZvbnQKPDwKICAvVHlwZSAvRm9udAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCgo1IDAgb2JqICA1IHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIFdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAgCjAwMDAwMDAxNTcgMDAwMDAgbiAgCjAwMDAwMDAyNTUgMDAwMDAgbiAgCjAwMDAwMDAzNDQgMDAwMDAgbiAgCnRyYWlsZXIKPDwKICAvU2l6ZSA2CiAgL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQ0OQolJUVPRgo=";

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 5));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));

    const handleWheel = (e) => {
        if (e.ctrlKey || e.metaKey) return; // Let browser handle browser-zoom
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(scale + delta, 0.5), 5); // limits 0.5x to 5x
        setScale(newScale);
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            e.preventDefault();
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 80px)', gap: '0' }}>
            {/* Left Pane: Image Viewer */}
            <div style={{ flex: 1, background: '#374151', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 10,
                    background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)', padding: '8px 16px', borderRadius: '24px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}>
                    {/* File Navigation */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.3)', paddingRight: '16px' }}>
                        <button
                            onClick={onBack}
                            style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
                            title="Close Preview"
                        >
                            ✕
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.3)', paddingRight: '16px' }}>
                        <button onClick={onPrevDoc} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '18px' }} title="Previous File">⏮️</button>
                        <button onClick={onNextDoc} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '18px' }} title="Next File">⏭️</button>
                    </div>

                    {/* Zoom Controls */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.3)', paddingRight: '16px' }}>
                        <button onClick={handleZoomOut} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>−</button>
                        <span style={{ color: 'white', fontSize: '13px', minWidth: '40px', textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
                        <button onClick={handleZoomIn} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px' }}>+</button>
                    </div>

                    {/* Page Navigation */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            style={{ background: 'transparent', color: 'white', border: 'none', cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
                        >
                            ◀
                        </button>
                        <span style={{ color: 'white', fontSize: '13px' }}>Page {page} of {totalPages}</span>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            style={{ background: 'transparent', color: 'white', border: 'none', cursor: page === totalPages ? 'default' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
                        >
                            ▶
                        </button>
                    </div>
                </div>

                <div
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#374151',
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    {data.file && (data.file.toLowerCase().endsWith('.jpg') || data.file.toLowerCase().endsWith('.png')) ? (
                        <img
                            src={`https://placehold.co/600x800/png?text=${encodeURIComponent(data.file)}`}
                            alt="Document Preview"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                transformOrigin: 'center center',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                userSelect: 'none',
                                pointerEvents: 'none'
                            }}
                        />
                    ) : (
                        <div style={{
                            width: 'fit-content',
                            height: 'fit-content',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                            transformOrigin: 'center center',
                            userSelect: 'none',
                            pointerEvents: 'none'
                        }}>
                            <img
                                src="https://placehold.co/600x800/FFFFFF/000000/png?text=PDF+Document%0A(Preview)"
                                alt="PDF Mock"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Right Pane: Metadata & History */}
            <div style={{ width: '400px', background: 'white', borderLeft: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB' }}>
                    <button
                        onClick={() => setActiveTab('metadata')}
                        style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'metadata' ? '2px solid #2563EB' : 'none', color: activeTab === 'metadata' ? '#2563EB' : '#6B7280', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Metadata
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        style={{ flex: 1, padding: '16px', background: 'none', border: 'none', borderBottom: activeTab === 'history' ? '2px solid #2563EB' : 'none', color: activeTab === 'history' ? '#2563EB' : '#6B7280', fontWeight: 600, cursor: 'pointer' }}
                    >
                        Audit History
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '18px', margin: 0 }}>{data.title}</h2>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>ID: {data.id}</div>
                        <div style={{
                            marginTop: '8px',
                            display: 'inline-block',
                            background: '#DEF7EC',
                            color: '#03543F',
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '10px'
                        }}>
                            READ-ONLY SOURCE OF TRUTH
                        </div>
                    </div>

                    {activeTab === 'metadata' && (
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {/* Extracted Data Section */}
                            <div>
                                <h3 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '12px' }}>Extracted Data</h3>
                                {Object.entries(data.ocrContent).map(([key, value]) => (
                                    <div key={key} style={{ marginBottom: '12px' }}>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '4px', textTransform: 'capitalize' }}>
                                            {key}
                                        </label>
                                        <input
                                            type="text"
                                            value={value}
                                            disabled
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                border: '1px solid #E5E7EB',
                                                background: '#F9FAFB',
                                                color: '#374151',
                                                cursor: 'not-allowed'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Physical Location Section */}
                            <div>
                                <h3 style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '12px', marginTop: '10px' }}>Physical Location</h3>
                                {data.physicalLocation && Object.entries(data.physicalLocation).map(([key, value]) => (
                                    <div key={key} style={{ marginBottom: '12px' }}>
                                        <label style={{ display: 'block', fontSize: '12px', color: '#6B7280', marginBottom: '4px', textTransform: 'capitalize' }}>
                                            {key || 'Unknown'}
                                        </label>
                                        <input
                                            type="text"
                                            value={value}
                                            disabled
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                border: '1px solid #E5E7EB',
                                                background: '#F9FAFB',
                                                color: '#374151',
                                                cursor: 'not-allowed'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {data.history ? data.history.map((log, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D1D5DB' }}></div>
                                        {idx < data.history.length - 1 && <div style={{ width: '2px', flex: 1, background: '#E5E7EB', margin: '4px 0' }}></div>}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{log.action}</div>
                                        <div style={{ fontSize: '12px', color: '#6B7280' }}>by {log.user}</div>
                                        <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '2px' }}>{log.details}</div>
                                        <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>{new Date(log.date).toLocaleString()}</div>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ color: '#9CA3AF', fontSize: '13px', fontStyle: 'italic' }}>No history available.</div>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid #E5E7EB' }}>
                    <button
                        onClick={onBack}
                        style={{ width: '100%', padding: '10px', background: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataPreviewer;
