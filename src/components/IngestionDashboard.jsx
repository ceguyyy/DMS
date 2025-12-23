import React, { useState, useRef, useEffect } from 'react';

const IngestionDashboard = ({ batches, onNavigateToQC, onOpenModal }) => {
    // Filter State
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterColumn, setFilterColumn] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [activeFilters, setActiveFilters] = useState(null); // { column: 'id', value: '...' }
    const filterRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleApplyFilter = () => {
        if (filterColumn && filterValue) {
            setActiveFilters({ column: filterColumn, value: filterValue });
            setIsFilterOpen(false);
        }
    };

    const handleResetFilter = () => {
        setFilterColumn('');
        setFilterValue('');
        setActiveFilters(null);
        setIsFilterOpen(false);
    };

    // Filter Logic
    const filteredBatches = batches.filter(batch => {
        if (!activeFilters) return true;
        const itemValue = batch[activeFilters.column]?.toString().toLowerCase() || '';
        return itemValue.includes(activeFilters.value.toLowerCase());
    });

    // Derived Stats
    const totalDocs = batches.length;
    const needsReview = batches.filter(b => b.status === 'PROCESSING' || b.status === 'DRAFT').length; // Assuming DRAFT/PROCESSING needs attention
    const synced = batches.filter(b => b.status === 'SYNCED').length; // We don't have SYNCED status in initial data, but good to have logic
    const errors = batches.filter(b => b.status === 'ERROR').length;

    return (
        <div id="view-ingestion">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '8px', position: 'relative' }} ref={filterRef}>
                    {/* Search Input (kept for quick text search if needed, or remove if redundant) */}
                    {/* <input type="text" placeholder="Search batch ID..." className="form-input" style={{ width: '250px' }} /> */}

                    <button
                        className="btn btn-outline"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        style={{ background: activeFilters ? '#EFF6FF' : 'white', borderColor: activeFilters ? 'var(--primary)' : 'var(--input-border)', color: activeFilters ? 'var(--primary)' : 'var(--text-main)' }}
                    >
                        <i className="icon-filter" style={{ marginRight: '6px' }}>Filter</i> {activeFilters ? '(Active)' : ''}
                    </button>

                    {/* Filter Popover */}
                    {isFilterOpen && (
                        <div style={{
                            position: 'absolute', top: '100%', left: 0, marginTop: '8px',
                            background: 'white', border: '1px solid var(--border)', borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '300px', padding: '16px', zIndex: 10
                        }}>
                            <div style={{ marginBottom: '12px' }}>
                                <label className="form-label" style={{ fontSize: '12px' }}>Filter by</label>
                                <select
                                    className="form-input"
                                    value={filterColumn}
                                    onChange={(e) => setFilterColumn(e.target.value)}
                                >
                                    <option value="" disabled>Select column</option>
                                    <option value="id">Batch ID</option>
                                    <option value="file">File Name</option>
                                    <option value="cat">Category</option>
                                    <option value="status">Status</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label className="form-label" style={{ fontSize: '12px' }}>Filter value</label>
                                <input
                                    type="text"
                                    className="form-input" placeholder="Enter value"
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button className="btn" style={{ color: 'var(--text-sub)' }} onClick={handleResetFilter}>Reset</button>
                                <button className="btn btn-primary" onClick={handleApplyFilter}>Apply</button>
                            </div>
                        </div>
                    )}
                </div>
                <button className="btn btn-primary" onClick={onOpenModal}>+ Create Upload Batch</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ border: '1px solid var(--border)', padding: '16px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-sub)' }}>TOTAL DOCUMENTS</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>{totalDocs}</div>
                </div>
                <div style={{ border: '1px solid var(--border)', padding: '16px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-sub)' }}>NEEDS REVIEW</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: 'var(--primary)' }}>{needsReview}</div>
                </div>
                <div style={{ border: '1px solid var(--border)', padding: '16px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-sub)' }}>SYNCED TODAY</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: 'var(--success-text)' }}>{synced}</div>
                </div>
                <div style={{ border: '1px solid var(--border)', padding: '16px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-sub)' }}>ERRORS</div>
                    <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px', color: 'var(--danger)' }}>{errors}</div>
                </div>
            </div>

            <div className="table-container">
                <table className="custom-table" id="batchTable">
                    <thead>
                        <tr>
                            <th>Batch ID</th>
                            <th>File Name</th>
                            <th>Category Suggestion</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBatches.map(row => (
                            <tr
                                key={row.id}
                                onClick={() => row.status === 'DRAFT' && onNavigateToQC(row.id)}
                                style={{
                                    cursor: row.status === 'DRAFT' ? 'pointer' : 'default',
                                    background: row.status === 'DRAFT' ? 'white' : '#f9fafb'
                                }}
                                className="table-row-hover"
                            >
                                <td>{row.id}</td>
                                <td>{row.file}</td>
                                <td>{row.cat}</td>
                                <td>
                                    {row.status === 'DRAFT' && <span style={{ background: 'var(--success-bg)', color: 'var(--success-text)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '11px' }}>DRAFT</span>}
                                    {row.status === 'ERROR' && <span style={{ background: '#FEE2E2', color: '#B91C1C', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '11px' }}>ERROR</span>}
                                    {row.status === 'PROCESSING' && <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '11px' }}>PROCESSING</span>}
                                </td>
                                <td>{row.date}</td>
                                <td>
                                    {row.status === 'DRAFT' ? (
                                        <button className="btn" style={{ padding: '4px', color: 'var(--primary)' }} onClick={(e) => { e.stopPropagation(); onNavigateToQC(row.id); }}>Review</button>
                                    ) : (
                                        <button className="btn" style={{ padding: '4px', color: 'var(--text-sub)' }} disabled>View</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IngestionDashboard;
