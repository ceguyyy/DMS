import React, { useState } from 'react';

const GlobalSearch = () => {
    const [query, setQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setHasSearched(true);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Global Semantic Search</h1>
                <p style={{ color: 'var(--text-sub)' }}>
                    Type a natural language query to find documents based on context, not just keywords.
                    <br />
                    <i>Powered by Mekari Airene</i>
                </p>
            </div>

            <div style={{ position: 'relative', marginBottom: '40px' }}>
                <input
                    type="text"
                    className="form-input"
                    style={{ padding: '16px 20px', fontSize: '16px', borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    placeholder="e.g. 'Find all land disputes in Bandung from last year'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
                <div style={{ position: 'absolute', right: '16px', top: '16px', color: 'var(--primary)', fontWeight: 600 }}>
                    🔍
                </div>
            </div>

            {!hasSearched && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-sub)', textTransform: 'uppercase', marginBottom: '16px' }}>Suggested Queries</div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {['Sertifikat tanah di Jakarta Selatan', 'Izin bangunan 2024 yang ditolak', 'AJB expired last month'].map(tag => (
                            <div
                                key={tag}
                                style={{ background: '#F3F4F6', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', color: 'var(--text-main)', cursor: 'pointer' }}
                                onClick={() => { setQuery(tag); setHasSearched(true); }}
                            >
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {hasSearched && (
                <div className="results-area">
                    <div style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--text-sub)' }}>
                        Found 3 results for <b>"{query}"</b> (0.45s)
                    </div>

                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            style={{ padding: '20px', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', marginBottom: '16px', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                            onClick={() => setSelectedResult({ id: i, title: `Sertifikat Hak Milik - No. 10.05.02.${80 + i}` })}
                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '16px' }}>Sertifikat Hak Milik - No. 10.05.02.{80 + i}</div>
                                <div style={{ fontSize: '12px', background: '#e0e7ff', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px' }}>98% Match</div>
                            </div>
                            <div style={{ fontSize: '13px', color: 'var(--text-sub)', marginBottom: '12px' }}>
                                /legal/land/shm/Bandung_Area/2023
                            </div>
                            <div style={{ fontSize: '13px', lineHeight: '1.5', color: '#374151' }}>
                                ...berlokasi di <b>Bandung</b> seluas 500m2. Dokumen ini tercatat memiliki sengketa batas wilayah pada tahun <b>2023</b> yang telah diselesaikan melalui...
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedResult && (
                <div className="modal-overlay" onClick={() => setSelectedResult(null)} style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
                    <div className="modal-box" onClick={e => e.stopPropagation()} style={{ width: '800px', height: '80vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px' }}>{selectedResult.title}</h3>
                                <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Preview Mode</span>
                            </div>
                            <button className="btn btn-outline" onClick={() => setSelectedResult(null)} style={{ padding: '4px 8px' }}>Close</button>
                        </div>
                        <div style={{ flex: 1, background: '#374151', padding: '20px', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
                            <div className="mock-doc" style={{ width: '100%', height: 'auto', minHeight: '800px', transform: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                                <h2 style={{ textAlign: 'center', borderBottom: '2px solid black', marginBottom: '30px' }}>{selectedResult.title}</h2>
                                <p style={{ fontSize: '14px', lineHeight: '1.8', textAlign: 'justify' }}>
                                    <b>NOMOR:</b> 10.05.02.{80 + selectedResult.id}<br />
                                    <b>PEMEGANG HAK:</b> PT. PAKUWON JATI TBK<br />
                                    <b>KEDUDUKAN:</b> SURABAYA<br />
                                    <br />
                                    Bahwa bidang tanah yang diuraikan dalam Surat Ukur tanggal 20-10-2023 Nomor 00123/2023 seluas 500 M2 (Lima Ratus Meter Persegi) terletak di Provinsi Jawa Barat, Kota Bandung, Kecamatan Cibeunying Kaler.
                                    <br /><br />
                                    Jual beli ini telah dilakukan dihadapan Pejabat Pembuat Akta Tanah (PPAT) dengan Akta Jual Beli Nomor 123/2010.
                                    <br /><br />
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    <br /><br />
                                    <div style={{ textAlign: 'center', marginTop: '50px', border: '1px solid #ddd', padding: '20px' }}>
                                        [ SEAL OF LAND AGENCY ]
                                        <br />
                                        <div style={{ fontSize: '10px', color: '#666', marginTop: '10px' }}>Digitally Signed by BPN System</div>
                                    </div>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
