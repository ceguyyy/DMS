import React, { useState } from 'react';

const GlobalSearch = ({ onNavigateToDoc }) => {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('IDLE'); // IDLE, PROCESSING, RESULTS
    const [selectedResult, setSelectedResult] = useState(null);

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            setStatus('PROCESSING');
            // Simulate Mekari Airene Latency
            setTimeout(() => {
                setStatus('RESULTS');
            }, 1200);
        }
    };

    const mockResults = {
        documents: [
            { id: 81, title: 'Akta Jual Beli - Sungai Brantas', match: 98, snippet: '...sengketa batas wilayah <b>sungai</b> pada tahun 1998...', location: 'Gedung A / Lantai 1 / Rak 05 / Box 10' },
            { id: 82, title: 'Sertifikat - Lahan Basah', match: 85, snippet: '...area konservasi <b>air</b> dan irigasi teknis...', location: 'Gedung A / Lantai 1 / Rak 05 / Box 12' }
        ],
        folders: [
            { name: 'Box 10 - 1998 Archives', path: 'Gedung A / Lantai 1 / Rak 05' },
            { name: 'Box 12 - Irigasi Project', path: 'Gedung A / Lantai 1 / Rak 05' }
        ]
    };

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ marginBottom: '16px', color: '#111827', fontSize: '28px', fontWeight: 700 }}>Global Semantic Search</h1>
                <p style={{ color: '#6B7280', fontSize: '16px' }}>
                    Ask questions in natural language. Powered by <span style={{ color: '#2563EB', fontWeight: 600 }}>Mekari Airene</span>.
                </p>
            </div>

            <div style={{ position: 'relative', marginBottom: '40px' }}>
                <input
                    type="text"
                    className="form-input"
                    style={{
                        padding: '18px 24px',
                        fontSize: '16px',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        width: '100%'
                    }}
                    placeholder="e.g. 'Find land deeds related to river disputes in 1998'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        position: 'absolute',
                        right: '8px',
                        top: '8px',
                        bottom: '8px',
                        background: '#2563EB',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0 20px',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    {status === 'PROCESSING' ? 'Thinking...' : 'Search'}
                </button>
            </div>

            {status === 'IDLE' && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '16px' }}>Try asking</div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {['Sertifikat tanah di Jakarta Selatan', 'River disputes 1998', 'Izin bangunan 2024 rejected'].map(tag => (
                            <div
                                key={tag}
                                style={{ background: 'white', border: '1px solid #E5E7EB', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', color: '#374151', cursor: 'pointer', transition: 'all 0.2s' }}
                                onClick={() => { setQuery(tag); handleSearch({ key: 'Enter' }); }}
                                onMouseOver={e => e.currentTarget.style.borderColor = '#2563EB'}
                                onMouseOut={e => e.currentTarget.style.borderColor = '#E5E7EB'}
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {status === 'RESULTS' && (
                <div className="results-area" style={{ animation: 'fadeIn 0.5s' }}>
                    <div style={{ marginBottom: '24px', padding: '16px', background: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                        <div style={{ fontSize: '12px', color: '#1E40AF', fontWeight: 600, marginBottom: '4px' }}>MEKARI AIRENE INSIGHT</div>
                        <div style={{ fontSize: '14px', color: '#1E3A8A' }}>
                            I found concepts related to <b>"river" (sungai, air)</b> and <b>"disputes" (sengketa)</b> in the archives. Showing results ranked by semantic relevance.
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                        {/* Documents Column */}
                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#4B5563', marginBottom: '16px' }}>DOCUMENT MATCHES</h3>
                            {mockResults.documents.map(doc => (
                                <div
                                    key={doc.id}
                                    style={{ padding: '20px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', marginBottom: '16px', cursor: 'pointer', transition: 'all 0.2s' }}
                                    onClick={() => onNavigateToDoc && onNavigateToDoc(doc.id)}
                                    onMouseOver={e => {
                                        e.currentTarget.style.borderColor = '#2563EB';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.borderColor = '#E5E7EB';
                                        e.currentTarget.style.transform = 'none';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ fontWeight: 600, color: '#111827', fontSize: '16px' }}>{doc.title}</div>
                                        <div style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>{doc.match}% Match</div>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        📁 {doc.location}
                                    </div>
                                    <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#4B5563', background: '#F9FAFB', padding: '8px', borderRadius: '6px' }} dangerouslySetInnerHTML={{ __html: doc.snippet }} />
                                </div>
                            ))}
                        </div>

                        {/* Folders Column */}
                        <div>
                            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#4B5563', marginBottom: '16px' }}>RELEVANT BOXES</h3>
                            {mockResults.folders.map(folder => (
                                <div
                                    key={folder.name}
                                    style={{ padding: '16px', background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', marginBottom: '12px' }}
                                >
                                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
                                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{folder.name}</div>
                                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>{folder.path}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default GlobalSearch;
