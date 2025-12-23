
import React, { useState } from 'react';

const QCWorkspace = ({ onApprove, data, onNext, onPrev, hasNext, hasPrev, categories = [] }) => {

    const [activeTab, setActiveTab] = useState('meta');
    const [locValue, setLocValue] = useState('');
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });

    // Reset zoom, pan, and populate form when document changes
    React.useEffect(() => {
        setZoom(1);
        setPan({ x: 0, y: 0 });

        if (data.physicalLocation) {
            setLocationState({
                building: data.physicalLocation.building || '',
                level: data.physicalLocation.level || '',
                room: data.physicalLocation.room || '',
                rack: data.physicalLocation.rack || ''
            });
            setLocValue(data.physicalLocation.box || '');
        } else {
            // Reset to empty if no data
            setLocationState({ building: '', level: '', room: '', rack: '' });
            setLocValue('');
        }
    }, [data.id]);

    const handleWheel = (e) => {
        // Zoom on scroll without Ctrl key
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPan({
            x: e.clientX - startPan.x,
            y: e.clientY - startPan.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Cascading Filter State
    const [locationState, setLocationState] = useState({
        building: '',
        level: '',
        room: '',
        rack: ''
    });

    const handleLocationChange = (field, value) => {
        // Update current field
        const newState = { ...locationState, [field]: value };

        // Reset downstream fields upon upstream change
        if (field === 'building') { newState.level = ''; newState.room = ''; newState.rack = ''; setLocValue(''); }
        if (field === 'level') { newState.room = ''; newState.rack = ''; setLocValue(''); }
        if (field === 'room') { newState.rack = ''; setLocValue(''); }
        if (field === 'rack') { setLocValue(''); }

        setLocationState(newState);
    };

    const isValid = locValue.length >= 3;

    // categories prop is used instead of hardcoded list
    const categoryOptions = [
        { id: "", label: "-- Select Category --", name: "-- Select Category --" },
        ...categories
    ];

    if (!data) return <div>Loading...</div>;

    return (
        <div className="split-view">
            {/* Viewer Panel */}
            <div
                className="panel-viewer"
                style={{ position: 'relative', overflow: 'hidden', cursor: isDragging ? 'grabbing' : 'grab' }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    className="mock-doc"
                    style={{
                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                        transformOrigin: 'top center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                >
                    <h2 style={{ textAlign: 'center', borderBottom: '2px solid black' }}>{data.title}</h2>
                    <p style={{ marginTop: '20px', fontSize: '14px', lineHeight: '1.6' }}>
                        <b>NO:</b> <span id="ocr-doc-no">{data.ocrContent.no}</span><br />
                        <b>PROVINSI:</b> {data.ocrContent.provinsi}<br />
                        <b>PEMEGANG HAK:</b> {data.ocrContent.pemegang}<br />
                        <b>TANGGAL:</b> {data.ocrContent.tanggal}<br />
                        <b>LUAS:</b> {data.ocrContent.luas}
                    </p>
                    <div style={{ position: 'absolute', bottom: '40px', right: '40px', border: '2px solid red', padding: '5px 10px', color: 'red', fontWeight: 'bold', transform: 'rotate(-15deg)', opacity: 0.3 }}>
                        COPY
                    </div>
                </div>

                {/* Navigation Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '8px 12px',
                    borderRadius: '50px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 20,
                    border: '1px solid rgba(0,0,0,0.05)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex'
                }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 500 }}>
                        Zoom: {Math.round(zoom * 100)}%
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            className="btn"
                            disabled={!hasPrev}
                            onClick={onPrev}
                            style={{
                                padding: '8px 16px',
                                fontSize: '13px',
                                borderRadius: '24px',
                                background: hasPrev ? 'white' : '#f3f4f6',
                                color: hasPrev ? 'var(--text-main)' : '#9ca3af',
                                border: '1px solid #e5e7eb',
                                cursor: hasPrev ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <span>←</span> Prev
                        </button>
                        <button
                            className="btn"
                            disabled={!hasNext}
                            onClick={onNext}
                            style={{
                                padding: '8px 16px',
                                fontSize: '13px',
                                borderRadius: '24px',
                                background: hasNext ? 'var(--primary)' : '#f3f4f6',
                                color: hasNext ? 'white' : '#9ca3af',
                                border: hasNext ? 'none' : '1px solid #e5e7eb',
                                cursor: hasNext ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontWeight: 500
                            }}
                        >
                            Next <span>→</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Metadata Panel */}
            <div className="panel-metadata">
                <div className="tab-header">
                    {['meta', 'raw', 'audit'].map(tab => (
                        <div
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'meta' ? 'Metadata' : tab === 'raw' ? 'Raw OCR' : 'Audit Log'}
                        </div>
                    ))}
                </div>

                {activeTab === 'meta' && (
                    <div id="tab-meta" className="tab-content active">
                        <div className="form-group">
                            <label className="form-label">Category (Master Data) <span className="required">*</span></label>
                            <select className="form-input">
                                {categoryOptions.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name || cat.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Document Date</label>
                            <input type="date" className="form-input" defaultValue="2023-10-20" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Physical Location (Lokasi Fisik) <span class="required">*</span></label>
                            {/* Cascading Location Selection */}
                            <div style={{ background: '#F9FAFB', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                {/* Level 1: Building */}
                                <div style={{ marginBottom: '8px' }}>
                                    <label className="form-label" style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Building</label>
                                    <select
                                        className="form-input"
                                        style={{ fontSize: '13px' }}
                                        value={locationState.building}
                                        onChange={(e) => handleLocationChange('building', e.target.value)}
                                    >
                                        <option value="">-- Select Building --</option>
                                        <option value="LOC-001">Gedung A (Main HQ)</option>
                                        <option value="LOC-999">Gedung B (Warehouse)</option>
                                    </select>
                                </div>

                                {/* Level 2: Level (Dependent) */}
                                {locationState.building && (
                                    <div style={{ marginBottom: '8px' }}>
                                        <label className="form-label" style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Level</label>
                                        <select
                                            className="form-input"
                                            style={{ fontSize: '13px' }}
                                            value={locationState.level}
                                            onChange={(e) => handleLocationChange('level', e.target.value)}
                                        >
                                            <option value="">-- Select Level --</option>
                                            <option value="LOC-002">Lantai 1</option>
                                            <option value="LOC-002-2">Lantai 2</option>
                                        </select>
                                    </div>
                                )}

                                {/* Level 3: Room (Dependent) */}
                                {locationState.level && (
                                    <div style={{ marginBottom: '8px' }}>
                                        <label className="form-label" style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Room</label>
                                        <select
                                            className="form-input"
                                            style={{ fontSize: '13px' }}
                                            value={locationState.room}
                                            onChange={(e) => handleLocationChange('room', e.target.value)}
                                        >
                                            <option value="">-- Select Room --</option>
                                            <option value="LOC-003">Ruang Arsip 101</option>
                                        </select>
                                    </div>
                                )}

                                {/* Level 4: Rack (Dependent) */}
                                {locationState.room && (
                                    <div style={{ marginBottom: '8px' }}>
                                        <label className="form-label" style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Rack</label>
                                        <select
                                            className="form-input"
                                            style={{ fontSize: '13px' }}
                                            value={locationState.rack}
                                            onChange={(e) => handleLocationChange('rack', e.target.value)}
                                        >
                                            <option value="">-- Select Rack --</option>
                                            <option value="LOC-004">Rak A-01</option>
                                            <option value="LOC-004-2">Rak A-02</option>
                                        </select>
                                    </div>
                                )}

                                {/* Level 5: Box (Dependent) */}
                                {locationState.rack && (
                                    <div>
                                        <label className="form-label" style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Box (Target)</label>
                                        <select
                                            className="form-input"
                                            style={{ fontSize: '13px', borderColor: 'var(--primary)', background: '#EFF6FF' }}
                                            value={locValue}
                                            onChange={(e) => setLocValue(e.target.value)}
                                        >
                                            <option value="">-- Select Box --</option>
                                            <option value="LOC-005">Box 2023-A</option>
                                            <option value="LOC-005-2">Box 2023-B</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Owner Name</label>
                            <input type="text" className="form-input" defaultValue={data.ocrContent.pemegang} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tags / Keywords</label>
                            <input type="text" className="form-input" placeholder="Add tags separated by comma..." />
                        </div>

                        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
                            <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>Reject</button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                disabled={!isValid}
                                onClick={onApprove}
                            >
                                Approve & Sync
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'raw' && (
                    <div id="tab-raw" className="tab-content active">
                        <div className="form-group">
                            <label className="form-label">Confidence Score</label>
                            <div style={{ background: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '92%', background: 'var(--success-text)', height: '100%' }}></div>
                            </div>
                            <div style={{ fontSize: '11px', textAlign: 'right', marginTop: '4px' }}>92% Accurate</div>
                        </div>
                        <textarea className="form-input" rows="15" style={{ fontFamily: 'monospace' }} defaultValue={data.rawText}></textarea>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div id="tab-audit" className="tab-content active">
                        <div style={{ fontSize: '12px', color: 'var(--text-sub)', borderLeft: '2px solid var(--border)', paddingLeft: '12px', marginBottom: '12px' }}>
                            <b>10:45 AM</b> - Uploaded by Scanner_01
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-sub)', borderLeft: '2px solid var(--primary)', paddingLeft: '12px', marginBottom: '12px' }}>
                            <b>10:46 AM</b> - OCR Processed (Akira)
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-main)', borderLeft: '2px solid var(--border)', paddingLeft: '12px' }}>
                            <b>Now</b> - Being reviewed by Christian G.
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default QCWorkspace;
